const { resolve } = require('path');
const { findConfig } = require('browserslist');

function reachConfig(rootPath, configPath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const io = require(resolve(rootPath, configPath));
    return function func(params) {
      const config = typeof io === 'function' ? io(params) : io;
      if (typeof config === 'object') {
        return config;
      }
      throw Error('Config should be an Object');
    };
  } catch (err) {
    throw Error(err.message);
  }
}

function reachBrowsers(rootPath) {
  const { production = [], development = [] } = findConfig(rootPath) || {};
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
