import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

import { parse as tomlParse } from '@ltd/j-toml';
import { decode as iniParse } from 'ini';
import yaml from 'yaml';

const Require = createRequire(import.meta.url);

// eslint-disable-next-line consistent-return
function ensureConfig(type, rootPath) {
  try {
    const filename = `.best-shot/env.${type}`;

    return {
      type,
      name: filename,
      path: Require.resolve(resolve(rootPath, filename)),
    };
  } catch {}
}

function filterData(object) {
  return Object.fromEntries(
    Object.entries(object).filter(([_, value]) => value !== undefined),
  );
}

export function findConfig(rootPath) {
  return (
    ensureConfig('toml', rootPath) ||
    ensureConfig('ini', rootPath) ||
    ensureConfig('yaml', rootPath) ||
    ensureConfig('json', rootPath)
  );
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

function wrap(string, parser) {
  const io = string.trim();

  return io ? parser(io) : {};
}

function pure(object) {
  return JSON.parse(JSON.stringify(object));
}

const parser = {
  ini: (str) => pure(iniParse(str)),
  json: (str) => JSON.parse(str),
  toml: (str) => pure(tomlParse(str, { bigint: false })),
  yaml: (str) => pure(yaml.parse(str)),
};

export function parseConfig({ path, name, type } = {}) {
  if (!path) {
    return {};
  }

  try {
    const data = readFileSync(path, 'utf8');

    return wrap(data, parser[type]);
  } catch (error) {
    console.error(error);
    throw new Error(`Parse \`${name}\` fail`);
  }
}
