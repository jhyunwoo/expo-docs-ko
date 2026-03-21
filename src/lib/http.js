function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetriableStatus(status) {
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
}

export async function fetchText(url, { headers = {}, timeoutMs = 60_000, retries = 5 } = {}) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        if (attempt < retries && isRetriableStatus(response.status)) {
          await sleep(500 * 2 ** attempt);
          continue;
        }

        throw new Error(`Request failed for ${url} with ${response.status}: ${body.slice(0, 500)}`);
      }

      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt >= retries) {
        break;
      }

      await sleep(500 * 2 ** attempt);
    }
  }

  throw lastError;
}
