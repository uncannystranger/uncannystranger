import { syncFrameStories } from '../src/server/frameStorySync.js';

try {
  const report = await syncFrameStories();
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Frame sync failed.';
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
