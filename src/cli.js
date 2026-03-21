#!/usr/bin/env node

import { discoverCommand } from './commands/discover.js';
import { translateCommand } from './commands/translate.js';
import { verifyCommand } from './commands/verify.js';
import { loadConfig } from './config.js';
import { ensureDir } from './lib/files.js';

const command = process.argv[2];
const config = loadConfig();

async function main() {
  await ensureDir(config.cacheDir);
  await ensureDir(config.manifestDir);
  await ensureDir(config.outputDir);
  await ensureDir(config.reportsDir);

  switch (command) {
    case 'discover': {
      const manifest = await discoverCommand(config);
      console.log(`Discovered ${manifest.routeCount} routes and wrote ${config.manifestPath}`);
      break;
    }
    case 'translate': {
      const manifest = await translateCommand(config);
      console.log(`Translated ${manifest.routes.filter(route => route.status === 'translated').length} routes.`);
      break;
    }
    case 'verify': {
      const report = await verifyCommand(config);
      console.log(`Verification passed for ${report.routeCount} routes.`);
      break;
    }
    case 'sync': {
      const manifest = await discoverCommand(config);
      console.log(`Discovered ${manifest.routeCount} routes.`);
      await translateCommand(config);
      const report = await verifyCommand(config);
      console.log(`Sync completed. Verified ${report.routeCount} routes.`);
      break;
    }
    default:
      console.error('Usage: node ./src/cli.js <discover|translate|verify|sync>');
      process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
