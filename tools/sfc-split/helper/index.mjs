import { deepmerge as deepMerge } from 'deepmerge-ts';
import { parse as yamlParse } from 'yaml';

export const COMPONENT_ROOT = 'as-components';

export const CLSX_PLACEHOLDER = '__PATH_OF_CLSX__';

function unique(...arr) {
  return [...new Set(arr)];
}

export function getAllPages(config = {}) {
  const {
    entryPagePath,
    pages = [],
    subPackages = [],
    tabBar: { custom = false, list = [] } = {},
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
    custom === true ? 'custom-tab-bar/index' : '',
  ).filter(Boolean);
}

export function patchConfig(json = {}) {
  const object = structuredClone(json);

  object.pages ??= [];

  if (object.tabBar?.list?.length > 0) {
    for (const tab of object.tabBar.list) {
      if (tab.pagePath && !object.pages.includes(tab.pagePath)) {
        object.pages.push(tab.pagePath);
      }
    }
  }

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
