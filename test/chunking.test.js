import test from 'node:test';
import assert from 'node:assert/strict';

import { chunkMarkdownBody } from '../src/lib/chunking.js';

test('chunkMarkdownBody keeps fenced code blocks intact', () => {
  const markdown = [
    '# Heading',
    '',
    'Intro paragraph.',
    '',
    '```sh',
    'npx create-expo-app@latest',
    '```',
    '',
    '## Next steps',
    '',
    'More text.',
  ].join('\n');

  const chunks = chunkMarkdownBody(markdown, 60);
  assert.equal(
    chunks.some(chunk => chunk.includes('```sh\nnpx create-expo-app@latest\n```')),
    true
  );
});

test('chunkMarkdownBody does not split adjacent list items', () => {
  const markdown = [
    '# Steps',
    '',
    '- Install Expo CLI',
    '- Create a project',
    '- Run the app',
    '',
    '## After',
    '',
    'Done.',
  ].join('\n');

  const chunks = chunkMarkdownBody(markdown, 55);
  assert.equal(
    chunks.some(chunk => chunk.includes('- Install Expo CLI\n- Create a project\n- Run the app')),
    true
  );
});
