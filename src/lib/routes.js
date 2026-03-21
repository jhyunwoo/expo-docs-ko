import path from 'node:path';

const HIDDEN_PREFIXES = ['/archive/', '/internal/'];

function tryBuildRegex(filter) {
  try {
    return new RegExp(filter);
  } catch {
    return undefined;
  }
}

export function normalizeRoute(input) {
  const url = input.startsWith('http://') || input.startsWith('https://') ? new URL(input) : null;
  let route = url ? url.pathname : input;

  if (!route.startsWith('/')) {
    route = `/${route}`;
  }

  route = route.replace(/\/{2,}/g, '/');
  if (route !== '/' && !route.endsWith('/')) {
    route = `${route}/`;
  }

  return route;
}

export function isVisibleExpoRoute(route) {
  return !HIDDEN_PREFIXES.some(prefix => route === prefix || route.startsWith(prefix));
}

export function buildSourceUrl(docsOrigin, route) {
  return new URL(route.slice(1) || '', `${docsOrigin}/`).toString();
}

export function routeToOutputRelativePath(route, baseDir = 'ko') {
  if (route === '/') {
    return path.posix.join(baseDir, 'index.md');
  }

  const segments = route.split('/').filter(Boolean);
  return path.posix.join(baseDir, ...segments, 'index.md');
}

export function routeToGroup(route) {
  if (route === '/') {
    return 'root';
  }

  return route.split('/').filter(Boolean)[0];
}

export function routeToCacheKey(route) {
  if (route === '/') {
    return 'root';
  }

  return route
    .replace(/^\/|\/$/g, '')
    .replace(/[^a-zA-Z0-9/_-]+/g, '-')
    .replace(/\//g, '__');
}

export function routeMatchesFilter(route, filter) {
  if (!filter) {
    return true;
  }

  const regex = tryBuildRegex(filter);
  return regex ? regex.test(route) : route.includes(filter);
}

export function selectRoutes(routes, { routeFilter, routeLimit }) {
  const filtered = routeFilter ? routes.filter(route => routeMatchesFilter(route.route, routeFilter)) : routes;
  if (!routeLimit) {
    return filtered;
  }

  return filtered.slice(0, routeLimit);
}

export function createRouteRecord({ route, docsOrigin, discoveredAt }) {
  return {
    route,
    sourceUrl: buildSourceUrl(docsOrigin, route),
    outputPath: routeToOutputRelativePath(route),
    routeGroup: routeToGroup(route),
    discoveredAt,
    sourceHash: null,
    sourceCachePath: null,
    translationGroupId: null,
    translatedAt: null,
    status: 'pending',
  };
}
