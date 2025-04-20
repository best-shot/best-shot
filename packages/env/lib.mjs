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
  { mode, watch: isWatch, serve: isServe },
  { development, production, watch, serve, ...rest },
) {
  return filterData(
    mode === 'production'
      ? { ...rest, ...production }
      : {
          ...rest,
          ...production,
          ...development,
          ...(isWatch || isServe ? watch : undefined),
          ...(isServe ? serve : undefined),
        },
  );
}
