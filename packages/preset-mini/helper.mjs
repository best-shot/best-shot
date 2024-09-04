import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'yaml';

function read(base, name) {
  try {
    return readFileSync(resolve(base, name), 'utf8');
  } catch {
    return false;
  }
}

export function readYAML(base = process.cwd()) {
  const file =
    read(base, 'app.yaml') ||
    read(base, 'app.yml') ||
    read(base, 'app.json') ||
    {};

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
