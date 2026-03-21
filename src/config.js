import path from 'node:path';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
const DEFAULT_CONCURRENCY = 4;
const DEFAULT_MAX_CHUNK_CHARS = 12_000;
const DEFAULT_TRANSLATION_PROVIDER = 'auto';
const DEFAULT_OLLAMA_BASE_URL = 'http://127.0.0.1:11434';
const DEFAULT_OLLAMA_MODEL = 'gpt-oss:20b';

function parsePositiveInteger(value, fallback) {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer but received "${value}".`);
  }

  return parsed;
}

function parseOptionalPositiveInteger(value) {
  if (!value) {
    return undefined;
  }

  return parsePositiveInteger(value, undefined);
}

export function loadConfig(env = process.env, cwd = process.cwd()) {
  const translationProvider = env.TRANSLATION_PROVIDER ?? DEFAULT_TRANSLATION_PROVIDER;
  const hasOpenAiConfig = Boolean(env.OPENAI_API_KEY && env.OPENAI_MODEL);
  const defaultConcurrency =
    !env.CONCURRENCY && (translationProvider === 'ollama' || (translationProvider === 'auto' && !hasOpenAiConfig))
      ? 1
      : DEFAULT_CONCURRENCY;

  return {
    cwd,
    docsOrigin: 'https://docs.expo.dev',
    sitemapUrl: 'https://docs.expo.dev/sitemap.xml',
    translationProvider,
    openAiApiKey: env.OPENAI_API_KEY ?? '',
    openAiModel: env.OPENAI_MODEL ?? '',
    openAiBaseUrl: env.OPENAI_BASE_URL ?? DEFAULT_BASE_URL,
    ollamaBaseUrl: env.OLLAMA_BASE_URL ?? DEFAULT_OLLAMA_BASE_URL,
    ollamaModel: env.OLLAMA_MODEL ?? DEFAULT_OLLAMA_MODEL,
    concurrency: parsePositiveInteger(env.CONCURRENCY, defaultConcurrency),
    maxChunkChars: parsePositiveInteger(env.MAX_CHUNK_CHARS, DEFAULT_MAX_CHUNK_CHARS),
    routeLimit: parseOptionalPositiveInteger(env.ROUTE_LIMIT),
    routeFilter: env.ROUTE_FILTER?.trim() || '',
    cacheDir: path.join(cwd, '.cache'),
    manifestDir: path.join(cwd, 'manifest'),
    manifestPath: path.join(cwd, 'manifest', 'routes.json'),
    outputDir: path.join(cwd, 'ko'),
    reportsDir: path.join(cwd, 'reports'),
    reportsPath: path.join(cwd, 'reports', 'verification.json'),
  };
}
