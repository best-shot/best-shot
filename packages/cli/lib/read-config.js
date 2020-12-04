const { resolve } = require('path');
const slash = require('slash');

const validate = require('@best-shot/core/lib/validator');

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

const schema = {
  oneOf: [
    { type: 'object' },
    {
      type: 'array',
      items: { type: 'object' },
    },
  ],
};

module.exports = function readConfig(rootPath) {
  return function func(params) {
    const io = requireConfig(rootPath);

    const config = typeof io === 'function' ? io(params) : io;

    // @ts-ignore
    validate({ schema, data: config });

    if (typeof config === 'object') {
      config.outputPath =
        config.outputPath || slash('.best-shot/build/[platform]');
    }

    return config;
  };
};
