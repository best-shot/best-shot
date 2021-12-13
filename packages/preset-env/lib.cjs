'use strict';

const { readFileSync } = require('fs');
const pickBy = require('lodash/pickBy');

const toml = require('@ltd/j-toml');
const yaml = require('js-yaml');
const ini = require('ini');

// eslint-disable-next-line consistent-return
function ensureConfig(type, rootPath) {
  try {
    const filename = `.best-shot/env.${type}`;
    return {
      type,
      name: filename,
      path: require.resolve(`./${filename}`, { paths: [rootPath] }),
    };
  } catch {}
}

function findConfig(rootPath) {
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

function mergeParams(
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
          ...(isWatch || isServe ? watch : {}),
          ...(isServe ? serve : {}),
        },
  );
}

const parser = {
  ini: (str) => ini.parse(str),
  json: (str) => JSON.parse(str),
  toml: (str) => toml.parse(str, { bigint: false }),
  yaml: (str) => yaml.load(str),
};

function parseConfig({ path, name, type } = {}) {
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

module.exports = {
  filterData,
  findConfig,
  mergeParams,
  parseConfig,
};
