import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { deepmerge as deepMerge } from 'deepmerge-ts';
import { parse as yamlParse } from 'yaml';

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
    return yamlParse(yaml);
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

export function patchConfig({ ...object }) {
  object.lazyCodeLoading = 'requiredComponents';
  object.subPackages ??= [];
  object.preloadRule ??= {};

  for (const page of object.pages) {
    object.preloadRule[page] ??= {};

    object.preloadRule[page].network = 'all';
    object.preloadRule[page].packages ??= [];

    if (!object.preloadRule[page].packages.includes(COMPONENT_ROOT)) {
      object.preloadRule[page].packages.push(COMPONENT_ROOT);
    }
  }

  if (
    !object.subPackages.some((subPackage) => subPackage.root === COMPONENT_ROOT)
  ) {
    object.subPackages.push({
      root: COMPONENT_ROOT,
      pages: ['fake'],
    });
  }

  return object;
}

export function mergeConfig(customBlocks) {
  const configs = customBlocks
    .filter(
      (block) =>
        block &&
        block.type === 'config' &&
        (block.lang === 'json' || block.lang === 'yaml') &&
        block.content &&
        block.content.trim(),
    )
    .map((block) =>
      block.lang === 'yaml'
        ? yamlParse(block.content)
        : JSON.parse(block.content),
    );

  return configs.length > 1 ? deepMerge(...configs) : configs[0] || {};
}

export function toJSONString(object) {
  return JSON.stringify(object, null, 2);
}
