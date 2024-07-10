import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'yaml';

export const readYAML = (path) =>
  parse(readFileSync(resolve(process.cwd(), path), 'utf8'));

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
