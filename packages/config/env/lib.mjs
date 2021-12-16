import { readFileSync } from 'fs';
import { resolve } from 'path';

// eslint-disable-next-line import/namespace, import/named
import { parse as tomlParse } from '@ltd/j-toml';
import { parse as iniParse } from 'ini';
import pickBy from 'lodash/pickBy.js';
import yaml from 'yaml';

// eslint-disable-next-line consistent-return
function ensureConfig(type, rootPath) {
  try {
    const filename = `.best-shot/env.${type}`;
    return {
      type,
      name: filename,
      path: resolve(rootPath, filename),
    };
  } catch {}
}

export function findConfig(rootPath) {
  return (
    ensureConfig('toml', rootPath) ||
    ensureConfig('ini', rootPath) ||
    ensureConfig('yaml', rootPath) ||
    ensureConfig('json', rootPath)
  );
}

function filterData(data) {
  return pickBy(data, (item) => item !== undefined);
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

const parser = {
  ini: (str) => iniParse(str),
  json: (str) => JSON.parse(str),
  toml: (str) => tomlParse(str, { bigint: false }),
  yaml: (str) => yaml.parse(str),
};

export function parseConfig({ path, name, type } = {}) {
  if (!path) {
    return {};
  }

  try {
    const data = readFileSync(path, 'utf8');
    return parser[type](data);
  } catch (error) {
    console.error(error);
    throw new Error(`Parse \`${name}\` fail`);
  }
}
