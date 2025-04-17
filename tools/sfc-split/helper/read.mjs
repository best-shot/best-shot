import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse as yamlParse } from 'yaml';

function tryReadFileWithParsers(base, name, candidates) {
  for (const { ext, parser } of candidates) {
    const filePath = resolve(base, `${name}${ext}`);

    try {
      const content = readFileSync(filePath, 'utf8');

      return {
        filePath,
        config: (parser ? parser(content) : content) || {},
      };
    } catch {
      return { filePath: '', config: {} };
    }
  }
}

const candidates = [
  { ext: '.yaml', parser: yamlParse },
  { ext: '.yml', parser: yamlParse },
  { ext: '.json', parser: JSON.parse },
];

export function readConfig(base, name) {
  return tryReadFileWithParsers(base, name, candidates);
}
