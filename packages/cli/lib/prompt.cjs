const { resolve } = require('path');
const prompts = require('prompts');
const { cyan } = require('chalk');
const Configstore = require('configstore');

module.exports = function prompt(configs, configNames) {
  const cache = new Configstore(
    '',
    {},
    {
      configPath: resolve(
        process.cwd(),
        'node_modules/.cache/best-shot/prompt.json',
      ),
    },
  );
  const names = configs.map(({ name }) => name);

  if (configNames && configNames.length > 0) {
    const selected = configNames.filter((name) => names.includes(name));

    if (selected.length > 0) {
      console.log(cyan('CONFIG-NAME:'), selected.join(', '));
      return Promise.resolve(
        configs.filter(({ name }) => selected.includes(name)),
      );
    }
  }

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
};
