import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse as tomlParse } from '@ltd/j-toml';
import { decode as iniParse } from 'ini';
import { parse as yamlParse } from 'yaml';

function tryReadFileWithParsers(base, name, ext, parser) {
  const filePath = resolve(base, `${name}${ext}`);

  try {
    const content = readFileSync(filePath, 'utf8');

    return {
      filePath,
      config: structuredClone(parser(content)),
    };
  } catch {
    return false;
  }
}

const candidates = [
  { ext: '.toml', parser: (str) => tomlParse(str, { bigint: false }) },
  { ext: '.yaml', parser: yamlParse },
  { ext: '.yml', parser: yamlParse },
  { ext: '.ini', parser: iniParse },
  { ext: '.json', parser: JSON.parse },
];

export function readConfig(base, name) {
  for (const { ext, parser } of candidates) {
    const result = tryReadFileWithParsers(base, name, ext, parser);

    if (result !== false) {
      return result;
    }
  }

  return false;
}
