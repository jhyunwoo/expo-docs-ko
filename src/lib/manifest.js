import { readJson, writeJson } from './files.js';

export async function loadManifest(manifestPath) {
  return readJson(manifestPath);
}

export async function saveManifest(manifestPath, manifest) {
  await writeJson(manifestPath, manifest);
}
