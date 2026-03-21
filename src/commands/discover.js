import { fetchText } from '../lib/http.js';
import { saveManifest } from '../lib/manifest.js';
import { createRouteRecord, isVisibleExpoRoute, normalizeRoute, selectRoutes } from '../lib/routes.js';

function parseSitemap(xml) {
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), match => match[1].trim());
}

export async function discoverCommand(config) {
  const sitemapXml = await fetchText(config.sitemapUrl, {
    headers: { Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.8' },
  });

  const discoveredAt = new Date().toISOString();
  const uniqueRoutes = [...new Set(parseSitemap(sitemapXml).map(url => normalizeRoute(url)))].filter(
    route => isVisibleExpoRoute(route) && !route.startsWith('/versions/unversioned/')
  );

  uniqueRoutes.sort((left, right) => left.localeCompare(right));

  const routeRecords = uniqueRoutes.map(route =>
    createRouteRecord({
      route,
      docsOrigin: config.docsOrigin,
      discoveredAt,
    })
  );

  const selectedRoutes = selectRoutes(routeRecords, config);
  const manifest = {
    version: 1,
    docsOrigin: config.docsOrigin,
    sitemapUrl: config.sitemapUrl,
    discoveredAt,
    routeFilter: config.routeFilter || null,
    routeLimit: config.routeLimit ?? null,
    routeCount: selectedRoutes.length,
    routes: selectedRoutes,
  };

  await saveManifest(config.manifestPath, manifest);
  return manifest;
}
