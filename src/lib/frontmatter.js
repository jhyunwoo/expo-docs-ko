const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n*/;

export function splitFrontmatter(markdown) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  const match = normalized.match(FRONTMATTER_PATTERN);
  if (!match) {
    return {
      frontmatter: '',
      body: normalized,
    };
  }

  return {
    frontmatter: match[0],
    body: normalized.slice(match[0].length),
  };
}

export function extractFrontmatterKeys(frontmatter) {
  if (!frontmatter) {
    return [];
  }

  return frontmatter
    .split('\n')
    .map(line => line.match(/^([A-Za-z0-9_-]+):\s*/)?.[1] ?? null)
    .filter(Boolean);
}
