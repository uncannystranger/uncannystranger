import { syncUnsplashGallery } from '../src/server/gallerySync.js';

try {
  const report = await syncUnsplashGallery();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Sync failed.';
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
