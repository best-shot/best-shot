import { rmSync } from 'node:fs';
import { resolve } from 'node:path';

export const command = 'clear';

export const describe = 'Clear best-shot cache';

export function builder() {}

export function handler() {
  rmSync(resolve(process.cwd(), 'node_modules/.cache/best-shot'), {
    recursive: true,
    force: true,
  });
}
