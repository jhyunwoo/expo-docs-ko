import path from 'node:path';

import { fileExists, readText, writeJson } from '../lib/files.js';
import {
  analyzeMarkdown,
  countHangulCharacters,
  countLatinLetters,
  findEmptySectionRecords,
  findEmptySections,
  hasSufficientHangulNarrative,
} from '../lib/markdown-structure.js';
import { loadManifest } from '../lib/manifest.js';
import { selectRoutes } from '../lib/routes.js';

function compareArrays(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function buildManualQaSamples(routes, targetCount = 12) {
  const samples = [];
  const seenGroups = new Set();

  for (const route of routes) {
    if (!seenGroups.has(route.routeGroup)) {
      samples.push(route.route);
      seenGroups.add(route.routeGroup);
    }
    if (samples.length >= targetCount) {
      return samples;
    }
  }

  for (const route of routes) {
    if (!samples.includes(route.route)) {
      samples.push(route.route);
    }
    if (samples.length >= targetCount) {
      break;
    }
  }

  return samples;
}

export async function verifyCommand(config) {
  const manifest = await loadManifest(config.manifestPath);
  const selectedRoutes = selectRoutes(manifest.routes, config);
  const issues = [];
  let translatedFileCount = 0;

  for (const route of selectedRoutes) {
    const outputPath = path.join(config.cwd, ...route.outputPath.split('/'));
    const hasOutput = await fileExists(outputPath);
    if (hasOutput) {
      translatedFileCount += 1;
    } else {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'missing-output',
        message: `Missing translated output at ${route.outputPath}.`,
      });
    }

    if (!route.sourceCachePath) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'missing-source-cache',
        message: 'Route has not been fetched yet.',
      });
      continue;
    }

    const sourcePath = path.join(config.cwd, route.sourceCachePath);
    if (!(await fileExists(sourcePath))) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'missing-source-file',
        message: `Missing cached source markdown at ${route.sourceCachePath}.`,
      });
      continue;
    }

    if (!hasOutput) {
      continue;
    }

    const [sourceMarkdown, translatedMarkdown] = await Promise.all([
      readText(sourcePath),
      readText(outputPath),
    ]);

    const sourceStructure = analyzeMarkdown(sourceMarkdown);
    const translatedStructure = analyzeMarkdown(translatedMarkdown);

    if (!compareArrays(sourceStructure.frontmatterKeys, translatedStructure.frontmatterKeys)) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'frontmatter-keys-mismatch',
        message: 'Frontmatter keys do not match the source.',
      });
    }

    if (sourceStructure.fenceBlockCount !== translatedStructure.fenceBlockCount) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'code-fence-count-mismatch',
        message: `Expected ${sourceStructure.fenceBlockCount} fenced code blocks, found ${translatedStructure.fenceBlockCount}.`,
      });
    }

    if (translatedStructure.hasUnbalancedFences) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'unbalanced-code-fence',
        message: 'Translated markdown contains unbalanced fenced code blocks.',
      });
    }

    if (sourceStructure.tableCount !== translatedStructure.tableCount) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'table-count-mismatch',
        message: `Expected ${sourceStructure.tableCount} tables, found ${translatedStructure.tableCount}.`,
      });
    }

    if (!compareArrays(sourceStructure.headingDepths, translatedStructure.headingDepths)) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'heading-depth-mismatch',
        message: 'Heading depth sequence changed after translation.',
      });
    }

    if (!compareArrays(sourceStructure.linkTargets, translatedStructure.linkTargets)) {
      issues.push({
        route: route.route,
        severity: 'error',
        code: 'link-targets-mismatch',
        message: 'Link targets changed after translation.',
      });
    }

    const sourceTrimmed = sourceMarkdown.trim();
    const isRedirectOnlySource = /^This page redirects to\b/.test(sourceTrimmed);
    const hangulCount = countHangulCharacters(translatedMarkdown);
    const latinCount = countLatinLetters(translatedMarkdown);
    if (!isRedirectOnlySource && !hasSufficientHangulNarrative(translatedMarkdown)) {
      issues.push({
        route: route.route,
        severity: 'warning',
        code: 'low-korean-ratio',
        message: `Translated markdown contains too little Korean text (hangul=${hangulCount}, latin=${latinCount}).`,
      });
    }

    const sourceEmptySections = findEmptySectionRecords(sourceMarkdown);
    const translatedEmptySections = findEmptySectionRecords(translatedMarkdown);
    const sourceEmptySectionIndexes = new Set(sourceEmptySections.map(section => section.index));
    const unexpectedEmptySections = translatedEmptySections.filter(
      section => !sourceEmptySectionIndexes.has(section.index)
    );
    if (unexpectedEmptySections.length > 0) {
      issues.push({
        route: route.route,
        severity: 'warning',
        code: 'empty-sections',
        message: `Translated markdown contains empty sections: ${unexpectedEmptySections
          .map(section => section.heading)
          .join(', ')}`,
      });
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    routeCount: selectedRoutes.length,
    translatedFileCount,
    issueCount: issues.length,
    manualQaSamples: buildManualQaSamples(selectedRoutes),
    issues,
  };

  await writeJson(config.reportsPath, report);

  if (issues.some(issue => issue.severity === 'error')) {
    throw new Error(`Verification failed with ${issues.length} issues. See ${config.reportsPath}.`);
  }

  return report;
}
