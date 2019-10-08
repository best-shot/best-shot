'use strict';

const mapValues = require('lodash/mapValues');
const GitRevPlugin = require('git-rev-webpack-plugin');
const sortKeys = require('sort-keys');

// @ts-ignore
const { cyan } = require('chalk');
/* eslint-disable import/no-extraneous-dependencies */
const { DefinePlugin } = require('webpack');
const { pretty } = require('@best-shot/core/lib/common');
/* eslint-enable */

const { findConfig, mergeParams, parseConfig } = require('./lib');

exports.name = 'preset-env';

exports.apply = function apply({
  mode = 'development',
  options: { serve = false, watch = false },
  rootPath
}) {
  const configFile = findConfig(rootPath);
  const configObject = parseConfig(configFile);
  const data = mergeParams({ mode, serve, watch }, configObject);

  const gitRevPlugin = new GitRevPlugin();
  if (gitRevPlugin.hash()) {
    data.GIT_BRANCH = gitRevPlugin.branch();
    data.GIT_HASH = gitRevPlugin.hash();
  }

  return chain => {
    if (Object.values(data).length > 0) {
      const sorted = sortKeys(data);

      console.log(cyan`PRESET-ENV`, pretty(sorted));

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
