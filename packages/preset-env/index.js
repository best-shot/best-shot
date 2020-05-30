const { cyan } = require('chalk');

const mapValues = require('lodash/mapValues');
const GitRevPlugin = require('git-rev-webpack-plugin');
const sortKeys = require('sort-keys');
const { pretty } = require('@best-shot/core/lib/common');
const { DefinePlugin } = require('webpack');

const { findConfig, mergeParams, parseConfig } = require('./lib');

exports.name = 'preset-env';

function logger({ GIT_BRANCH, GIT_HASH, ...data }) {
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

    const gitRevPlugin = new GitRevPlugin();
    if (gitRevPlugin.hash()) {
      data.GIT_BRANCH = gitRevPlugin.branch();
      data.GIT_HASH = gitRevPlugin.hash();
    }

    if (Object.values(data).length > 0) {
      const sorted = sortKeys(data);

      // @ts-ignore
      logger(sorted);

      const result = mapValues(sorted, JSON.stringify);
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
