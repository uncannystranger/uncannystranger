import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const source = path.join(root, 'Antonio');
const target = path.join(root, 'dist');

await fs.rm(target, { recursive: true, force: true });
await fs.mkdir(target, { recursive: true });
await fs.cp(source, target, { recursive: true });
