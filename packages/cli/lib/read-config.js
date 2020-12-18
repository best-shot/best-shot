const { resolve } = require('path');
const slash = require('slash');

const prompt = require('./prompt');
const validate = require('./validate');
const { isSafeError } = require('./utils');

// eslint-disable-next-line consistent-return
function readConfigFile(filename, rootPath = process.cwd()) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(resolve(rootPath, '.best-shot', filename));
  } catch (error) {
    if (!isSafeError(error)) {
      throw error;
    }
  }
}

async function requireConfig(rootPath) {
  return (
    readConfigFile('config.cjs', rootPath) ||
    readConfigFile('config.js', rootPath) ||
    {}
  );
}

module.exports = function readConfig(
  rootPath,
  interactive = process.stdout.isTTY,
) {
  return async function func({ command }) {
    let config = await requireConfig(rootPath);

    config = typeof config === 'function' ? config({ command }) : config;

    validate(config);

    if (typeof config === 'object' && !config.outputPath) {
      config.outputPath = slash('.best-shot/build/');
    }

    const configs = Array.isArray(config) ? config : [config];

    if (interactive && configs.length > 1) {
      return prompt(configs);
    }

    return configs;
  };
};
