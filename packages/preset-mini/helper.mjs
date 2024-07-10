import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'yaml';

export function readYAML(path, base = process.cwd()) {
  const file = readFileSync(resolve(base, path), 'utf8');

  return parse(file);
}

function unique(...arr) {
  return [...new Set(arr)];
}

export function getAllPages(config) {
  const { pages = [], subPackages = [], tabBar: { list = [] } = {} } = config;

  return unique(
    ...pages,
    ...list.map(({ pagePath }) => pagePath),
    ...subPackages.flatMap(
      (subPackage) =>
        subPackage.pages.map((page) => `${subPackage.root}/${page}`) || [],
    ),
  );
}
