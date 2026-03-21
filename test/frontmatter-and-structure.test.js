import test from 'node:test';
import assert from 'node:assert/strict';

import { splitFrontmatter } from '../src/lib/frontmatter.js';
import {
  analyzeMarkdown,
  findEmptySectionRecords,
  findEmptySections,
} from '../src/lib/markdown-structure.js';

test('splitFrontmatter separates yaml metadata from the body', () => {
  const markdown = [
    '---',
    'title: Example page',
    'description: Demo',
    'modificationDate: January 29, 2026',
    '---',
    '',
    '# Example',
    '',
    'Body',
  ].join('\n');

  const result = splitFrontmatter(markdown);
  assert.match(result.frontmatter, /^---\ntitle: Example page/);
  assert.equal(result.body, '# Example\n\nBody');
});

test('analyzeMarkdown extracts structural metrics', () => {
  const markdown = [
    '---',
    'title: Example page',
    'description: Demo',
    '---',
    '',
    '# Heading',
    '',
    'Paragraph with [link](/foo/).',
    '',
    '| Col |',
    '| --- |',
    '| Val |',
    '',
    '```ts',
    'console.log("hello");',
    '```',
  ].join('\n');

  const result = analyzeMarkdown(markdown);
  assert.deepEqual(result.frontmatterKeys, ['title', 'description']);
  assert.deepEqual(result.headingDepths, [1]);
  assert.equal(result.tableCount, 1);
  assert.equal(result.fenceBlockCount, 1);
  assert.deepEqual(result.linkTargets, ['/foo/']);
  assert.equal(result.hasUnbalancedFences, false);
});

test('findEmptySections reports headings with no content', () => {
  const markdown = ['# Filled', '', 'Text', '', '## Empty', '', '### Also filled', '', 'Text'].join('\n');
  assert.deepEqual(findEmptySections(markdown), []);
});

test('findEmptySections still reports truly empty headings', () => {
  const markdown = ['# Filled', '', 'Text', '', '## Empty', '', '## Next', '', 'Text'].join('\n');
  assert.deepEqual(findEmptySections(markdown), ['## Empty']);
});

test('findEmptySectionRecords tracks empty sections by heading order', () => {
  const markdown = ['# Filled', '', 'Text', '', '## Empty', '', '## Next', '', 'Text'].join('\n');
  assert.deepEqual(findEmptySectionRecords(markdown), [{ heading: '## Empty', index: 1 }]);
});
