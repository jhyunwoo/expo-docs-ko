function isFenceDelimiter(line) {
  return /^(```|~~~)/.test(line.trimStart());
}

function isHeading(line) {
  return /^#{1,6}\s+\S/.test(line);
}

function splitIntoSections(markdown) {
  const lines = markdown.split('\n');
  const sections = [];
  let buffer = [];
  let inFence = false;

  for (const line of lines) {
    const trimmed = line.trimStart();

    if (isFenceDelimiter(trimmed)) {
      inFence = !inFence;
    }

    if (!inFence && isHeading(line) && buffer.length > 0) {
      sections.push(buffer.join('\n').trimEnd());
      buffer = [line];
      continue;
    }

    buffer.push(line);
  }

  if (buffer.length > 0) {
    sections.push(buffer.join('\n').trimEnd());
  }

  return sections.filter(Boolean);
}

function splitLargeSection(section) {
  const blocks = [];
  const lines = section.split('\n');
  let buffer = [];
  let inFence = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (isFenceDelimiter(line)) {
      inFence = !inFence;
    }

    buffer.push(line);

    if (inFence) {
      continue;
    }

    const nextLine = lines[index + 1] ?? '';
    const currentLooksLikeList = /^(\s*)([-*+]|\d+\.)\s+/.test(line);
    const nextLooksLikeList = /^(\s*)([-*+]|\d+\.)\s+/.test(nextLine);
    const currentLooksLikeTable = /^\|.*\|$/.test(line.trim());
    const nextLooksLikeTable = /^\|.*\|$/.test(nextLine.trim());
    const currentLooksLikeHtml = /^<[^>]+>/.test(line.trim());
    const nextLooksLikeHtml = /^<[^>]+>/.test(nextLine.trim());

    if (nextLine === '') {
      if (currentLooksLikeList || currentLooksLikeTable || currentLooksLikeHtml) {
        continue;
      }

      blocks.push(buffer.join('\n').trimEnd());
      buffer = [];
      while (lines[index + 1] === '') {
        index += 1;
      }
      continue;
    }

    if (currentLooksLikeList && nextLooksLikeList) {
      continue;
    }

    if (currentLooksLikeTable && nextLooksLikeTable) {
      continue;
    }

    if (currentLooksLikeHtml && nextLooksLikeHtml) {
      continue;
    }
  }

  if (buffer.length > 0) {
    blocks.push(buffer.join('\n').trimEnd());
  }

  return blocks.filter(Boolean);
}

function hardWrapBlock(block, maxChars) {
  if (block.length <= maxChars) {
    return [block];
  }

  const lines = block.split('\n');
  const chunks = [];
  let current = '';

  for (const line of lines) {
    const candidate = current ? `${current}\n${line}` : line;
    if (candidate.length <= maxChars || current.length === 0) {
      current = candidate;
      continue;
    }

    chunks.push(current);
    current = line;
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

export function chunkMarkdownBody(markdown, maxChars) {
  if (!markdown.trim()) {
    return [];
  }

  const sections = splitIntoSections(markdown);
  const chunks = [];
  let current = '';

  function pushCurrent() {
    if (current) {
      chunks.push(current);
      current = '';
    }
  }

  for (const section of sections) {
    if (section.length <= maxChars) {
      const candidate = current ? `${current}\n\n${section}` : section;
      if (candidate.length <= maxChars) {
        current = candidate;
      } else {
        pushCurrent();
        current = section;
      }
      continue;
    }

    pushCurrent();
    const blocks = splitLargeSection(section);
    let blockChunk = '';

    for (const block of blocks) {
      const pieces = hardWrapBlock(block, maxChars);
      for (const piece of pieces) {
        const candidate = blockChunk ? `${blockChunk}\n\n${piece}` : piece;
        if (candidate.length <= maxChars) {
          blockChunk = candidate;
        } else {
          if (blockChunk) {
            chunks.push(blockChunk);
          }
          blockChunk = piece;
        }
      }
    }

    if (blockChunk) {
      chunks.push(blockChunk);
    }
  }

  pushCurrent();
  return chunks;
}
