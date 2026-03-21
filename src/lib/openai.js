function normalizeBaseUrl(url) {
  const stripped = url.endsWith('/') ? url.slice(0, -1) : url;
  if (/\/v\d+$/.test(stripped)) {
    return `${stripped}/`;
  }

  return `${stripped}/v1/`;
}

function extractResponseText(payload) {
  if (typeof payload.output_text === 'string' && payload.output_text) {
    return payload.output_text;
  }

  const output = Array.isArray(payload.output) ? payload.output : [];
  const parts = [];

  for (const item of output) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const chunk of content) {
      if (typeof chunk.text === 'string') {
        parts.push(chunk.text);
      }
    }
  }

  return parts.join('\n').trim();
}

async function callResponsesApi({ apiKey, baseUrl, model, systemPrompt, userPrompt }) {
  const url = new URL('responses', normalizeBaseUrl(baseUrl));
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: systemPrompt }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: userPrompt }],
        },
      ],
    }),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) {
    throw new Error(`Responses API failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const translated = extractResponseText(payload);
  if (!translated) {
    throw new Error('Responses API returned an empty translation.');
  }

  return translated;
}

async function callChatCompletionsApi({ apiKey, baseUrl, model, systemPrompt, userPrompt }) {
  const url = new URL('chat/completions', normalizeBaseUrl(baseUrl));
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(180_000),
  });

  if (!response.ok) {
    throw new Error(`Chat Completions API failed with ${response.status}: ${await response.text()}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const joined = content
      .map(part => (typeof part?.text === 'string' ? part.text : ''))
      .join('\n')
      .trim();
    if (joined) {
      return joined;
    }
  }

  throw new Error('Chat Completions API returned an empty translation.');
}

export async function translateWithOpenAi({ apiKey, baseUrl, model, systemPrompt, userPrompt }) {
  try {
    return await callResponsesApi({ apiKey, baseUrl, model, systemPrompt, userPrompt });
  } catch (responsesError) {
    return callChatCompletionsApi({ apiKey, baseUrl, model, systemPrompt, userPrompt }).catch(
      chatError => {
        throw new Error(
          `OpenAI translation failed. Responses error: ${responsesError.message} | Chat error: ${chatError.message}`
        );
      }
    );
  }
}
