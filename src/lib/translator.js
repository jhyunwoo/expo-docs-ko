import { translateWithOllama } from './ollama.js';
import { translateWithOpenAi } from './openai.js';

function resolveProvider(config) {
  if (config.translationProvider === 'openai') {
    return 'openai';
  }

  if (config.translationProvider === 'ollama') {
    return 'ollama';
  }

  if (config.openAiApiKey && config.openAiModel) {
    return 'openai';
  }

  return 'ollama';
}

export function explainMissingProviderConfig(config) {
  const provider = resolveProvider(config);
  if (provider === 'openai') {
    if (!config.openAiApiKey || !config.openAiModel) {
      return 'OPENAI_API_KEY and OPENAI_MODEL are required for OpenAI translation.';
    }
    return null;
  }

  if (!config.ollamaModel) {
    return 'OLLAMA_MODEL is required for Ollama translation.';
  }

  return null;
}

export async function translateWithProvider(config, prompts) {
  const provider = resolveProvider(config);
  if (provider === 'openai') {
    return translateWithOpenAi({
      apiKey: config.openAiApiKey,
      baseUrl: config.openAiBaseUrl,
      model: config.openAiModel,
      ...prompts,
    });
  }

  return translateWithOllama({
    baseUrl: config.ollamaBaseUrl,
    model: config.ollamaModel,
    ...prompts,
  });
}
