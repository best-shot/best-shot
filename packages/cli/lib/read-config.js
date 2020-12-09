const { resolve } = require('path');
const slash = require('slash');
const prompts = require('prompts');
const validate = require('@best-shot/core/lib/validate');

async function requireConfig(rootPath = process.cwd()) {
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

function ask(configs) {
  return prompts({
    type: 'multiselect',
    name: 'tasks',
    message: 'Pick your task to run',
    max: schema.oneOf[1].maxItems,
    min: schema.oneOf[1].minItems,
    choices: configs.map(({ name }) => ({ title: name, value: name })),
  }).then(({ tasks }) => configs.filter(({ name }) => tasks.includes(name)));
}

module.exports = function readConfig(rootPath) {
  return async function func({ command }) {
    const config = await requireConfig(rootPath);

    const data = typeof config === 'function' ? config({ command }) : config;

    // @ts-ignore
    validate({ schema, data });

    if (
      Array.isArray(data) &&
      new Set(data.map(({ name }) => name)).size !== data.length
    ) {
      throw new validate.ConfigError('every config[x].name should be unique');
    } else if (typeof data === 'object' && !data.outputPath) {
      data.outputPath = slash('.best-shot/build/');
    }

    const configs = Array.isArray(data) ? data : [data];

    if (process.stdout.isTTY && configs.length > 1) {
      return ask(configs);
    }

    return configs;
  };
};
