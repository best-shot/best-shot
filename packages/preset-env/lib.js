'use strict';

const { readFileSync } = require('fs');
const pickBy = require('lodash/pickBy');
const isBuiltinModule = require('is-builtin-module');
const tomlParser = require('@iarna/toml/parse');
const yaml = require('js-yaml');

function ensureConfig(type, rootPath) {
  try {
    const filename = `best-shot.env.${type}`;
    return {
      type,
      name: filename,
      path: require.resolve(`./${filename}`, { paths: [rootPath] })
    };
  } catch (error) {
    return undefined;
  }
}

function findConfig(rootPath) {
  return (
    ensureConfig('toml', rootPath)
    || ensureConfig('yaml', rootPath)
    || ensureConfig('json', rootPath)
  );
}

function mergeParams(
  { mode, watch: isWatch, serve: isServe },
  {
    development, production, watch, serve
  }
) {
  return {
    ...(mode === 'production'
      ? production
      : {
        ...production,
        ...development,
        ...(isWatch || isServe ? watch : {}),
        ...(isServe ? serve : {})
      })
  };
}

const parser = {
  json: str => JSON.parse(str),
  yaml: str => yaml.safeLoad(str),
  toml: str => tomlParser(str)
};

function parseConfig({ path, name, type } = {}) {
  try {
    const data = readFileSync(path, 'utf8');
    return parser[type](data);
  } catch (error) {
    console.error(error);
    throw new Error(`Parse \`${name}\` fail`);
  }
}

function filterData(data) {
  return pickBy(
    data,
    (value, key) => !isBuiltinModule(key.split('.')[0].toLowerCase())
  );
}

module.exports = {
  filterData,
  findConfig,
  mergeParams,
  parseConfig
};
