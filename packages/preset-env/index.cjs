const { inspect } = require('util');
const { cyan, level } = require('chalk');
const mapValues = require('lodash/mapValues');

const sortKeys = require('sort-keys');
const { DefinePlugin } = require('webpack');

const {
  findConfig,
  getGitHash,
  mergeParams,
  parseConfig,
} = require('./lib.cjs');

exports.name = 'preset-env';

function pretty(data) {
  return inspect(data, {
    compact: false,
    colors: Boolean(level),
    breakLength: 80,
    depth: 20,
  });
}

function logger({ 'BEST_SHOT.GIT_HASH': x, ...data }) {
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

    data['BEST_SHOT.GIT_HASH'] = GIT_HASH;

    if (Object.values(data).length > 0) {
      const sorted = sortKeys(data, { deep: true });

      // @ts-ignore
      logger(sorted);

      const result = mapValues(sorted, (value) => JSON.stringify(value));
      if (chain.plugins.has('define')) {
        chain
          .plugin('define')
          .tap(([options]) => [
            sortKeys({ ...result, ...options }, { deep: true }),
          ]);
      } else {
        chain.plugin('define').use(DefinePlugin, [result]);
      }
    }
  };
};
