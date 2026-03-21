function normalizeBaseUrl(url) {
  return url.endsWith('/') ? url : `${url}/`;
}

export async function translateWithOllama({ baseUrl, model, systemPrompt, userPrompt }) {
  const url = new URL('api/generate', normalizeBaseUrl(baseUrl));
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      system: systemPrompt,
      prompt: userPrompt,
      stream: false,
      options: {
        temperature: 0,
      },
    }),
    signal: AbortSignal.timeout(900_000),
  });

  if (!response.ok) {
    throw new Error(`Ollama API failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const translated = typeof payload.response === 'string' ? payload.response.trim() : '';
  if (!translated) {
    throw new Error('Ollama returned an empty translation.');
  }

  return translated.replace(/\r\n/g, '\n');
}
