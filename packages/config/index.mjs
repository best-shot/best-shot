import { resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import chalk from 'chalk';

import { prompt } from './prompt.mjs';
import { validate } from './validate.mjs';

const { cyan } = chalk;

function isSafeError(error) {
  return (
    error.code === 'ERR_MODULE_NOT_FOUND' &&
    error.message.endsWith(` imported from ${fileURLToPath(import.meta.url)}`)
  );
}

async function readConfigFile(filename, rootPath = process.cwd()) {
  return import(pathToFileURL(resolve(rootPath, '.best-shot', filename)))
    .then(({ default: config }) => config)
    .catch((error) => {
      if (isSafeError(error)) {
        return;
      }
      throw error;
    });
}

async function requireConfig(rootPath) {
  return (
    (await readConfigFile('config.mjs', rootPath)) ||
    (await readConfigFile('config.cjs', rootPath)) ||
    {}
  );
}

export async function getConfigs(rootPath, { command }) {
  const config = await requireConfig(rootPath);
  const io = typeof config === 'function' ? await config({ command }) : config;
  await validate(io);
  const configs = Array.isArray(io) ? io : [io];

  configs.forEach((conf) => {
    if (!conf.output) {
      // eslint-disable-next-line no-param-reassign
      conf.output = {};
    }
    if (!conf.output?.path) {
      // eslint-disable-next-line no-param-reassign
      conf.output.path = '.best-shot/build/[config-name]';
    }
  });

  return configs;
}

export function readConfig(rootPath, interactive = process.stdout.isTTY) {
  return async function func({ command, configName }) {
    const configs = await getConfigs(rootPath, { command });

    if (configName && configName.length > 0) {
      const names = configs.map(({ name }) => name);
      const matched = configName.filter((name) => names.includes(name));
      if (matched.length > 0) {
        console.log(cyan('CONFIG-NAME:'), matched.join(', '));
        return configs.filter(({ name }) => matched.includes(name));
      }
    }

    if (interactive && configs.length > 1) {
      return prompt(configs);
    }

    return configs;
  };
}
