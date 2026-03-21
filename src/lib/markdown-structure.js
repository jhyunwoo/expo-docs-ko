import { extractFrontmatterKeys, splitFrontmatter } from './frontmatter.js';

function isFenceDelimiter(line) {
  return /^(```|~~~)/.test(line.trimStart());
}

export function analyzeMarkdown(markdown) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  const { frontmatter, body } = splitFrontmatter(normalized);
  const lines = body.split('\n');

  const headingDepths = [];
  const linkTargets = [];
  let fenceCount = 0;
  let inFence = false;
  let tableCount = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    if (isFenceDelimiter(line)) {
      fenceCount += 1;
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+\S/);
    if (headingMatch) {
      headingDepths.push(headingMatch[1].length);
    }

    const nextLine = lines[index + 1] ?? '';
    if (/^\|.+\|$/.test(line.trim()) && /^\|(?:\s*:?-+:?\s*\|)+$/.test(nextLine.trim())) {
      tableCount += 1;
    }

    for (const match of line.matchAll(/\[[^\]]*]\(([^)]+)\)/g)) {
      linkTargets.push(match[1]);
    }
  }

  return {
    frontmatterKeys: extractFrontmatterKeys(frontmatter),
    headingDepths,
    fenceBlockCount: Math.floor(fenceCount / 2),
    hasUnbalancedFences: inFence,
    tableCount,
    linkTargets,
  };
}

export function findEmptySectionRecords(markdown) {
  const { body } = splitFrontmatter(markdown.replace(/\r\n/g, '\n'));
  const lines = body.split('\n');
  const issues = [];
  let currentHeading = null;
  let currentDepth = null;
  let currentContent = [];
  let currentIndex = null;
  let headingIndex = -1;

  function flush({ hasChildHeading = false } = {}) {
    if (!currentHeading) {
      return;
    }

    const hasVisibleContent = currentContent.some(line => line.trim() !== '');
    if (!hasVisibleContent && !hasChildHeading) {
      issues.push({
        heading: currentHeading,
        index: currentIndex,
      });
    }
  }

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+\S/);
    if (headingMatch) {
      const nextDepth = headingMatch[1].length;
      flush({
        hasChildHeading: currentDepth !== null && nextDepth > currentDepth,
      });
      headingIndex += 1;
      currentHeading = line;
      currentDepth = nextDepth;
      currentIndex = headingIndex;
      currentContent = [];
      continue;
    }

    if (currentHeading) {
      currentContent.push(line);
    }
  }

  flush();
  return issues;
}

export function findEmptySections(markdown) {
  return findEmptySectionRecords(markdown).map(record => record.heading);
}

function stripNonNarrativeContent(markdown) {
  let text = markdown.replace(/\r\n/g, '\n');
  text = text.replace(/^---\n[\s\S]*?\n---\n*/m, '');
  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/`[^`\n]+`/g, ' ');
  text = text.replace(/https?:\/\/\S+/g, ' ');
  text = text.replace(/\[[^\]]*]\(([^)]+)\)/g, ' ');
  text = text.replace(/<[^>]+>/g, ' ');
  return text;
}

export function countHangulCharacters(markdown) {
  const text = stripNonNarrativeContent(markdown);
  const matches = text.match(/[가-힣]/g);
  return matches ? matches.length : 0;
}

export function countLatinLetters(markdown) {
  const text = stripNonNarrativeContent(markdown);
  const matches = text.match(/[A-Za-z]/g);
  return matches ? matches.length : 0;
}

export function hasSufficientHangulNarrative(
  markdown,
  { minimumHangul = 90, minimumRatio = 0.2, minimumNarrativeLetters = 20 } = {}
) {
  const hangulCount = countHangulCharacters(markdown);
  const latinCount = countLatinLetters(markdown);
  const totalNarrativeLetters = hangulCount + latinCount;

  if (totalNarrativeLetters < minimumNarrativeLetters) {
    return hangulCount > 0;
  }

  if (hangulCount < minimumHangul) {
    return false;
  }

  if (totalNarrativeLetters === 0) {
    return false;
  }

  return hangulCount / totalNarrativeLetters >= minimumRatio;
}
