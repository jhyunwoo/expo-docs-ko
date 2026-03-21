import test from 'node:test';
import assert from 'node:assert/strict';

import { loadConfig } from '../src/config.js';
import {
  countHangulCharacters,
  countLatinLetters,
  hasSufficientHangulNarrative,
} from '../src/lib/markdown-structure.js';

test('loadConfig prefers single-threaded default when ollama is the active provider', () => {
  const config = loadConfig(
    {
      TRANSLATION_PROVIDER: 'ollama',
    },
    '/tmp/expo-docs-ko'
  );

  assert.equal(config.concurrency, 1);
  assert.equal(config.ollamaModel, 'gpt-oss:20b');
});

test('korean ratio helpers ignore code blocks and count prose characters', () => {
  const markdown = [
    '# 제목',
    '',
    'Expo는 앱을 만드는 데 도움을 줍니다.',
    '',
    '```sh',
    'npx create-expo-app',
    '```',
  ].join('\n');

  assert.equal(countHangulCharacters(markdown) > 5, true);
  assert.equal(countLatinLetters(markdown) < 10, true);
});

test('hasSufficientHangulNarrative allows mixed Korean docs with many product names', () => {
  const markdown = [
    '# 추가 리소스',
    '',
    'Expo, EAS, React Native와 관련된 자료를 한국어 설명과 함께 정리합니다. 이 문서는 도구 이름과 제품명이 많이 등장하지만 본문 설명은 한국어로 충분히 번역된 상태라고 가정합니다.',
    '',
    '- Expo CLI, React Native, App Store Connect 관련 안내를 한국어로 제공합니다.',
    '- Android와 iOS 설정을 빠르게 찾을 수 있습니다.',
    '- 각 링크 옆 설명은 사용 목적과 참고 시점을 한국어로 자세히 덧붙입니다.',
    '- 문서 전체는 외부 자료 모음 성격이지만, 독자가 무엇을 봐야 하는지 이해할 수 있도록 한국어 문장 비중을 유지합니다.',
  ].join('\n');

  assert.equal(hasSufficientHangulNarrative(markdown), true);
});

test('hasSufficientHangulNarrative allows reference-heavy docs with limited prose but enough Korean narrative', () => {
  const markdown = [
    '# EAS Hosting 워커 런타임',
    '',
    'EAS Hosting 워커 런타임과 Node.js 호환성에 대해 알아보세요.',
    '',
    '이 문서는 Node.js, JavaScript, Cloudflare Workers 같은 제품명과 식별자가 자주 등장하지만 설명 문장은 한국어로 번역되어 있습니다.',
    '',
    '실제 reference 표와 코드 예시는 영어 식별자를 유지하되, 독자가 제약과 지원 범위를 이해할 수 있도록 본문 설명은 한국어로 제공합니다.',
  ].join('\n');

  assert.equal(hasSufficientHangulNarrative(markdown), true);
});

test('hasSufficientHangulNarrative flags mostly untranslated English prose', () => {
  const markdown = [
    '# Security',
    '',
    'Learn how credentials and other sensitive data are handled when using EAS.',
    '',
    'This document explains what they are and how we store them.',
  ].join('\n');

  assert.equal(hasSufficientHangulNarrative(markdown), false);
});

test('hasSufficientHangulNarrative accepts very short Korean title-only pages', () => {
  const markdown = [
    '# 빌드',
  ].join('\n');

  assert.equal(hasSufficientHangulNarrative(markdown), true);
});
