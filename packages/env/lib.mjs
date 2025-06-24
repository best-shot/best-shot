import { readConfig } from './read.mjs';

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
  { development, production, watch, serve, [name]: naming, ...rest } = {},
) {
  return filterData({
    ...rest,
    ...production,
    ...(mode === 'development' ? development : undefined),
    ...(isWatch || isServe ? watch : undefined),
    ...(isServe ? serve : undefined),
    ...naming,
  });
}
