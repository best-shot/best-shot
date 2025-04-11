import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'yaml';

export const COMPONENT_ROOT = 'as-components';

function read(base, name) {
  try {
    return readFileSync(resolve(base, name), 'utf8');
  } catch {
    return false;
  }
}

export function readYAML(base, name) {
  const yaml = read(base, `${name}.yaml`) || read(base, `${name}.yml`);

  if (yaml) {
    return parse(yaml);
  }

  try {
    return JSON.parse(read(base, `${name}.json`));
  } catch {
    return {};
  }
}

function unique(...arr) {
  return [...new Set(arr)];
}

export function getAllPages(config) {
  const {
    entryPagePath,
    pages = [],
    subPackages = [],
    tabBar: { list = [] } = {},
  } = config;

  return unique(
    entryPagePath,
    ...pages,
    ...list.map(({ pagePath }) => pagePath),
    ...subPackages.flatMap(
      (subPackage) =>
        (subPackage.pages || []).map((page) => `${subPackage.root}/${page}`) ||
        [],
    ),
  ).filter(Boolean);
}
