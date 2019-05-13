'use strict';

const mapValues = require('lodash/mapValues');

const { cyan } = require('chalk');
/* eslint-disable import/no-extraneous-dependencies */
const { DefinePlugin } = require('webpack');
const { pretty } = require('@best-shot/core/lib/common');
/* eslint-enable */

const {
  findConfig, mergeParams, parseConfig, filterData
} = require('./lib');

exports.name = 'preset-env';

exports.apply = function apply({
  mode = 'development',
  options: { serve = false, watch = false },
  rootPath
}) {
  const env = { mode, serve, watch };
  const configPath = findConfig(rootPath);
  const configObject = parseConfig(configPath);
  const data = mergeParams(env, configObject);
  const filtered = filterData(data);
  if (filtered) {
    console.log(cyan`PRESET-ENV`, pretty(filtered));
    return chain => {
      const result = mapValues(filtered, JSON.stringify);
      const hasPlugin = chain.plugins.has('define');
      chain.plugin('define').when(
        hasPlugin,
        plugin => {
          plugin.tap(([options]) => [{ ...options, ...result }]);
        },
        plugin => {
          plugin.use(DefinePlugin, [result]);
        }
      );
    };
  }
  return undefined;
};
