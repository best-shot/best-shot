'use strict';

const { resolve } = require('path');
// @ts-ignore
const { findConfig } = require('browserslist');

function reachConfig(rootPath) {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  const io = require(resolve(rootPath, '.best-shot', 'config.js'));
  return function func(params) {
    const config = typeof io === 'function' ? io(params) : io;
    if (typeof config === 'object') {
      config.outputPath =
        config.outputPath || '.best-shot/build/[platform]/[mode:shorthand]';
      return config;
    }
    throw new TypeError('Config should be an Object');
  };
}

function reachBrowsers(rootPath) {
  const { defaults = [], production = defaults, development = defaults } =
    findConfig(rootPath) || {};
  return { production, development };
}

function reachDependencies(rootPath) {
  const fileName = resolve(rootPath, 'package.json');
  try {
    const {
      dependencies,
      devDependencies,
      optionalDependencies
      // eslint-disable-next-line global-require, import/no-dynamic-require
    } = require(fileName);
    return { dependencies, devDependencies, optionalDependencies };
  } catch (error) {
    return { note: 'Fail to list all dependencies' };
  }
}

module.exports = {
  reachConfig,
  reachBrowsers,
  reachDependencies
};
