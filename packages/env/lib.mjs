import { readConfig } from './read.mjs';

export function variables(object) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === 'object' ? variables(value) : JSON.stringify(value),
      ]),
  );
}

export function prefix(object) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      ['import.meta.env', key].filter(Boolean).join('.'),
      value,
    ]),
  );
}

function filterData(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== undefined),
  );
}

export function findConfig(rootPath) {
  return readConfig(rootPath, '.best-shot/env');
}

export function mergeParams(
  { mode, watch: isWatch, serve: isServe, name },
  { development, production, watch, serve, [name]: naming, share } = {},
) {
  return filterData({
    ...share,
    ...production,
    ...(mode === 'development' ? development : undefined),
    ...(isWatch || isServe ? watch : undefined),
    ...(isServe ? serve : undefined),
    ...naming,
  });
}
