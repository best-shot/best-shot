const { resolve } = require('path');
const slash = require('slash');
const { red } = require('chalk');

const validate = require('@best-shot/core/lib/validate');

function requireConfig(rootPath = process.cwd()) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(resolve(rootPath, '.best-shot', 'config.js'));
  } catch (error) {
    if (
      error.code === 'MODULE_NOT_FOUND' &&
      error.requireStack[0] === __filename
    ) {
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
      maxItems: 9,
      minItems: 1,
    },
  ],
};

module.exports = function readConfig(rootPath) {
  return function func({ command }) {
    const config = requireConfig(rootPath);

    const data = typeof config === 'function' ? config({ command }) : config;

    // @ts-ignore
    validate({ schema, data });

    if (
      Array.isArray(data) &&
      new Set(data.map(({ name }) => name)).size !== data.length
    ) {
      console.log(
        red('Error:'),
        'every configuration should have a unique name',
      );
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    } else if (typeof data === 'object' && !data.outputPath) {
      data.outputPath = slash('.best-shot/build/');
    }

    return Array.isArray(data) ? data : [data];
  };
};
