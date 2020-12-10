const { resolve } = require('path');
const prompts = require('prompts');
const Configstore = require('configstore');

module.exports = function prompt(configs) {
  const cache = new Configstore(
    '',
    {},
    {
      configPath: resolve(__dirname, '../.cache/prompt.json'),
    },
  );
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
};
