const { resolve } = require('path');
const slash = require('slash');
const prompts = require('prompts');
const validate = require('@best-shot/core/lib/validate');
const Configstore = require('configstore');
const { name: nameSpace } = require('../package.json');

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
      maxItems: 8,
      minItems: 1,
    },
  ],
};

function ask(configs) {
  const cache = new Configstore(nameSpace);
  const names = configs.map(({ name }) => name);
  const temp = cache.get('prompt') || names;

  return prompts(
    {
      instructions: false,
      message: 'Select some tasks(config.name) to run',
      name: 'tasks',
      type: 'multiselect',
      max: 4,
      min: 1,
      choices: names.map((name) => ({
        title: name,
        value: name,
        selected: temp.includes(name),
      })),
    },
    {
      onCancel() {
        throw new Error('The command have been cancelled');
      },
    },
  ).then(({ tasks = [] }) => {
    cache.set('prompt', tasks);
    return configs.filter(({ name }) => tasks.includes(name));
  });
}

module.exports = function readConfig(
  rootPath,
  interactive = process.stdout.isTTY,
) {
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

    if (interactive && configs.length > 1) {
      return ask(configs);
    }

    return configs;
  };
};
