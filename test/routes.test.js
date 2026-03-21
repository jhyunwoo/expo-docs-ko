import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createRouteRecord,
  normalizeRoute,
  routeMatchesFilter,
  routeToOutputRelativePath,
} from '../src/lib/routes.js';

test('normalizeRoute standardizes root and nested urls', () => {
  assert.equal(normalizeRoute('https://docs.expo.dev/get-started'), '/get-started/');
  assert.equal(normalizeRoute('/develop/tools'), '/develop/tools/');
  assert.equal(normalizeRoute('/'), '/');
});

test('routeToOutputRelativePath mirrors docs urls into ko directory', () => {
  assert.equal(routeToOutputRelativePath('/'), 'ko/index.md');
  assert.equal(routeToOutputRelativePath('/get-started/'), 'ko/get-started/index.md');
  assert.equal(
    routeToOutputRelativePath('/versions/latest/sdk/image/'),
    'ko/versions/latest/sdk/image/index.md'
  );
});

test('createRouteRecord fills core manifest fields', () => {
  const record = createRouteRecord({
    route: '/develop/tools/',
    docsOrigin: 'https://docs.expo.dev',
    discoveredAt: '2026-03-13T00:00:00.000Z',
  });

  assert.equal(record.sourceUrl, 'https://docs.expo.dev/develop/tools/');
  assert.equal(record.outputPath, 'ko/develop/tools/index.md');
  assert.equal(record.routeGroup, 'develop');
  assert.equal(record.status, 'pending');
});

test('routeMatchesFilter supports regex and substring filters', () => {
  assert.equal(routeMatchesFilter('/develop/tools/', 'develop'), true);
  assert.equal(routeMatchesFilter('/develop/tools/', '^/develop/'), true);
  assert.equal(routeMatchesFilter('/develop/tools/', 'router'), false);
});
