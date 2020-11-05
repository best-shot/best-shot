const { inspect } = require('util');
const { cyan, level } = require('chalk');
const mapValues = require('lodash/mapValues');

const sortKeys = require('sort-keys');
const { DefinePlugin } = require('webpack');

const { findConfig, mergeParams, parseConfig, getGitHash } = require('./lib');

exports.name = 'preset-env';

function pretty(data) {
  return inspect(data, {
    compact: false,
    colors: Boolean(level),
    breakLength: 80,
    depth: 20,
  });
}

function logger({ GIT_HASH, ...data }) {
  console.log(cyan`PRESET-ENV`, pretty(data));
}

exports.apply = function applyEnv() {
  return (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const context = chain.get('context');
    const serve = chain.devServer.entries() !== undefined;

    const configFile = findConfig(context);
    const configObject = parseConfig(configFile);
    const data = mergeParams({ mode, serve, watch }, configObject);

    const GIT_HASH = getGitHash();

    if (GIT_HASH) {
      data.GIT_HASH = GIT_HASH;
    }

    if (Object.values(data).length > 0) {
      const sorted = sortKeys(data);

      // @ts-ignore
      logger(sorted);

      const result = mapValues(sorted, (value) => JSON.stringify(value));
      if (chain.plugins.has('define')) {
        chain
          .plugin('define')
          .tap(([options]) => [sortKeys({ ...result, ...options })]);
      } else {
        chain.plugin('define').use(DefinePlugin, [result]);
      }
    }
  };
};
