import { readFileSync, writeFileSync } from 'fs';

import { cachePath } from '@best-shot/core/lib/utils.mjs';
import prompts from 'prompts';

function readCache(filename) {
  try {
    return JSON.parse(readFileSync(filename));
  } catch {
    return [];
  }
}

export function prompt(configs) {
  const names = configs.map(({ name }) => name);

  const tempPath = cachePath('prompt.json');

  const cache = readCache(tempPath);

  const temp = Array.isArray(cache) && cache.length > 0 ? cache : names || [];

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
    try {
      writeFileSync(tempPath, JSON.stringify(tasks), 'utf8');
    } catch {}

    return configs.filter(({ name }) => tasks.includes(name));
  });
}
