import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { getEnv } from '@best-shot/env';
import { ConfigError } from '@best-shot/validator';
import chalk from 'chalk';

import { prompt } from './prompt.mjs';
import { hasUniqueNames, validate } from './validate.mjs';

const { cyan } = chalk;

function isSafeError(error) {
  return (
    error.code === 'ERR_MODULE_NOT_FOUND' &&
    error.message.endsWith(` imported from ${fileURLToPath(import.meta.url)}`)
  );
}

async function readConfigFile(filename, rootPath = process.cwd()) {
  return import(
    /* webpackIgnore: true */ pathToFileURL(
      resolve(rootPath, '.best-shot', filename),
    )
  )
    .then(({ default: old, config = old, sideEffect }) => ({
      config,
      sideEffect,
    }))
    .catch((error) => {
      if (isSafeError(error)) {
        return;
      }

      throw error;
    });
}

async function requireConfig(rootPath) {
  return (await readConfigFile('config.mjs', rootPath)) || {};
}

async function getConfigs(rootPath, { command, mode }) {
  const { config = {}, sideEffect } = await requireConfig(rootPath);

  if (typeof sideEffect === 'function') {
    await sideEffect({ command });
  }

  const io =
    typeof config === 'function'
      ? await config({
          command,
          mode,
          envs: getEnv({
            root: rootPath,
            mode,
            watch: command === 'watch',
            serve: command === 'serve',
          }).envs,
        })
      : config;

  await validate(io);

  const configs = Array.isArray(io)
    ? io.map((conf) => ({ ...conf }))
    : [{ ...io }];

  configs.forEach(({ ...conf }, index) => {
    if (!conf.output) {
      configs[index].output = {};
    }

    if (!conf.output?.path) {
      configs[index].output.path = '.best-shot/build/[config-name]';
    }

    if (configs.length > 1 && !conf.name) {
      configs[index].name = `task${index + 1}`;
    }
  });

  if (configs.length > 1 && hasUniqueNames(configs)) {
    throw new ConfigError('every config[x].name should be unique');
  }

  return configs;
}

export function readConfig(
  rootPath = process.cwd(),
  interactive = process.stdout.isTTY,
) {
  return async function func({ mode, command, configName }) {
    const configs = await getConfigs(rootPath, { mode, command });

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
