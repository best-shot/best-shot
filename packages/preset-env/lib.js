const { readFileSync } = require('fs');
const pickBy = require('lodash/pickBy');
// @ts-ignore
const tomlParser = require('@iarna/toml/parse');
const yaml = require('js-yaml');
const { decode } = require('ini');

function ensureConfig(type, rootPath) {
  try {
    const filename = `.best-shot/env.${type}`;
    return {
      type,
      name: filename,
      path: require.resolve(`./${filename}`, { paths: [rootPath] }),
    };
  } catch (error) {
    return undefined;
  }
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
  json: (str) => JSON.parse(str),
  yaml: (str) => yaml.safeLoad(str),
  toml: (str) => tomlParser(str),
  ini: (str) => decode(str),
};

// @ts-ignore
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
