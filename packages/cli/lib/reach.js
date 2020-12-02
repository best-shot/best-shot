const { resolve } = require('path');
const slash = require('slash');

function requireConfig(rootPath) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(resolve(rootPath, '.best-shot', 'config.js'));
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      return {};
    }
    throw error;
  }
}

function reachConfig(rootPath) {
  return function func(params) {
    const io = requireConfig(rootPath);
    const config = typeof io === 'function' ? io(params) : io;
    if (typeof config === 'object') {
      config.outputPath =
        config.outputPath || slash('.best-shot/build/[platform]');
      return config;
    }
    throw new TypeError('Config should be an Object');
  };
}

module.exports = { reachConfig };
