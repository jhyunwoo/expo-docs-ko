import path from 'node:path';

import { chunkMarkdownBody } from '../lib/chunking.js';
import { ensureDir, fileExists, readJson, readText, writeJson, writeText } from '../lib/files.js';
import { splitFrontmatter } from '../lib/frontmatter.js';
import { sha256 } from '../lib/hash.js';
import { fetchText } from '../lib/http.js';
import { analyzeMarkdown } from '../lib/markdown-structure.js';
import { loadManifest, saveManifest } from '../lib/manifest.js';
import { runWithConcurrency } from '../lib/pool.js';
import { selectRoutes } from '../lib/routes.js';
import { explainMissingProviderConfig, translateWithProvider } from '../lib/translator.js';

const FRONTMATTER_KEYS_TO_PRESERVE = ['modificationDate', 'slug', 'permalink', 'canonicalUrl'];

function buildFrontmatterPrompt(chunk) {
  return {
    systemPrompt:
      'You translate Expo documentation YAML frontmatter from English to Korean. Return YAML only. Preserve keys, indentation, quoting style, URLs, version strings, slugs, dates, product names, package names, identifiers, and any value that looks machine-readable. Translate only natural-language values such as title or description.',
    userPrompt: [
      'Translate this YAML frontmatter into Korean.',
      `Do not translate values for these keys: ${FRONTMATTER_KEYS_TO_PRESERVE.join(', ')}.`,
      'Return only YAML frontmatter with the same keys.',
      '',
      chunk,
    ].join('\n'),
  };
}

function buildBodyPrompt(chunk) {
  return {
    systemPrompt:
      'You translate Expo documentation Markdown from English to Korean. Return Markdown only. Do not summarize or omit content. Preserve Markdown structure, headings, tables, code fences, inline code, HTML/JSX tags, URLs, file paths, environment variables, version strings, package names, CLI commands, JSON/YAML/TOML/code examples, and brand names such as Expo, EAS, React Native. Translate only natural language, including prose, link text, and image alt text.',
    userPrompt: ['Translate this Markdown into Korean and preserve the formatting exactly:', '', chunk].join(
      '\n'
    ),
  };
}

function getGroupPaths(config, sourceHash) {
  const groupDir = path.join(config.cacheDir, 'translations', sourceHash);
  return {
    groupDir,
    checkpointPath: path.join(groupDir, 'chunks.json'),
    finalPath: path.join(groupDir, 'final.md'),
  };
}

async function loadCheckpoint(checkpointPath) {
  if (!(await fileExists(checkpointPath))) {
    return { chunks: {}, completed: false };
  }

  return readJson(checkpointPath);
}

async function translateChunk(config, kind, chunk, groupId, chunkId) {
  const prompts = kind === 'frontmatter' ? buildFrontmatterPrompt(chunk) : buildBodyPrompt(chunk);

  const translated = await translateWithProvider(config, prompts);

  if (!translated.trim()) {
    throw new Error(`Received an empty translation for ${groupId}:${chunkId}`);
  }

  return translated.replace(/\r\n/g, '\n');
}

async function translateGroup(config, group, sourceMarkdown) {
  const { frontmatter, body } = splitFrontmatter(sourceMarkdown);
  const bodyChunks = chunkMarkdownBody(body, config.maxChunkChars);
  const inputChunks = [];

  if (frontmatter) {
    inputChunks.push({
      id: 'frontmatter',
      kind: 'frontmatter',
      source: frontmatter.trimEnd(),
    });
  }

  bodyChunks.forEach((chunk, index) => {
    inputChunks.push({
      id: `body-${String(index + 1).padStart(4, '0')}`,
      kind: 'body',
      source: chunk,
    });
  });

  const paths = getGroupPaths(config, group.sourceHash);
  await ensureDir(paths.groupDir);
  const checkpoint = await loadCheckpoint(paths.checkpointPath);

  for (const chunk of inputChunks) {
    const saved = checkpoint.chunks?.[chunk.id];
    if (saved?.source === chunk.source && saved?.translated) {
      continue;
    }

    const translated = await translateChunk(
      config,
      chunk.kind,
      chunk.source,
      group.translationGroupId,
      chunk.id
    );

    checkpoint.chunks ??= {};
    checkpoint.chunks[chunk.id] = {
      kind: chunk.kind,
      source: chunk.source,
      translated,
    };

    await writeJson(paths.checkpointPath, checkpoint);
  }

  const orderedTranslation = inputChunks
    .map(chunk => checkpoint.chunks[chunk.id]?.translated)
    .filter(Boolean)
    .join('\n\n')
    .trimEnd();

  await writeText(paths.finalPath, `${orderedTranslation}\n`);
  checkpoint.completed = true;
  checkpoint.finalPath = path.relative(config.cwd, paths.finalPath);
  checkpoint.completedAt = new Date().toISOString();
  await writeJson(paths.checkpointPath, checkpoint);

  return `${orderedTranslation}\n`;
}

async function fetchAndHashSource(config, route) {
  const markdown = await fetchText(route.sourceUrl, {
    headers: { Accept: 'text/markdown' },
    timeoutMs: 120_000,
    retries: 5,
  });

  const normalized = markdown.replace(/\r\n/g, '\n');
  const sourceHash = sha256(normalized);
  const sourcePath = path.join(config.cacheDir, 'sources', `${sourceHash}.md`);
  await writeText(sourcePath, normalized);

  route.sourceHash = sourceHash;
  route.sourceCachePath = path.relative(config.cwd, sourcePath);
  route.translationGroupId = sourceHash;
  route.status = 'fetched';

  return { sourceHash, sourcePath, markdown: normalized };
}

function getOutputFilePath(config, route) {
  return path.join(config.cwd, ...route.outputPath.split('/'));
}

function buildGroups(routes) {
  const groups = new Map();

  for (const route of routes) {
    if (!route.sourceHash) {
      continue;
    }

    if (!groups.has(route.sourceHash)) {
      groups.set(route.sourceHash, {
        sourceHash: route.sourceHash,
        translationGroupId: route.translationGroupId ?? route.sourceHash,
        routes: [],
      });
    }

    groups.get(route.sourceHash).routes.push(route);
  }

  return [...groups.values()].sort((left, right) => left.sourceHash.localeCompare(right.sourceHash));
}

function ensureOpenAiConfig(config) {
  const message = explainMissingProviderConfig(config);
  if (message) {
    throw new Error(message);
  }
}

export async function translateCommand(config) {
  ensureOpenAiConfig(config);

  const manifest = await loadManifest(config.manifestPath);
  const selectedRoutes = selectRoutes(manifest.routes, config);
  await ensureDir(path.join(config.cacheDir, 'sources'));

  const sourceByHash = new Map();
  await runWithConcurrency(selectedRoutes, config.concurrency, async route => {
    const fetched = await fetchAndHashSource(config, route);
    sourceByHash.set(fetched.sourceHash, fetched.markdown);
  });

  const groups = buildGroups(selectedRoutes);
  await runWithConcurrency(groups, config.concurrency, async group => {
    const sourceMarkdown = sourceByHash.get(group.sourceHash) ?? (await readText(
      path.join(config.cwd, group.routes[0].sourceCachePath)
    ));

    const translatedMarkdown = await translateGroup(config, group, sourceMarkdown);
    const translatedStructure = analyzeMarkdown(translatedMarkdown);
    if (translatedStructure.hasUnbalancedFences) {
      throw new Error(`Translated markdown has unbalanced fences for ${group.translationGroupId}`);
    }

    await Promise.all(
      group.routes.map(async route => {
        const outputFilePath = getOutputFilePath(config, route);
        await writeText(outputFilePath, translatedMarkdown);
        route.status = 'translated';
        route.translatedAt = new Date().toISOString();
      })
    );
  });

  manifest.routeCount = manifest.routes.length;
  manifest.translatedAt = new Date().toISOString();
  await saveManifest(config.manifestPath, manifest);
  return manifest;
}
