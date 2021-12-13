import { inspect } from 'util';

import chalk from 'chalk';
import mapValues from 'lodash/mapValues.js';
import sortKeys from 'sort-keys';

import { findConfig, mergeParams, parseConfig } from './lib.cjs';

function pretty(data) {
  return inspect(data, {
    compact: false,
    colors: Boolean(chalk.level),
    breakLength: 80,
    depth: 20,
  });
}

function logger(data) {
  console.log(chalk.cyan`PRESET-ENV`, pretty(data));
}

export function apply() {
  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const context = chain.get('context');
    const serve = chain.devServer.entries() !== undefined;

    const configFile = findConfig(context);
    const configObject = parseConfig(configFile);
    const data = mergeParams({ mode, serve, watch }, configObject);

    if (Object.values(data).length > 0) {
      const sorted = sortKeys(data, { deep: true });

      logger(sorted);

      const result = mapValues(sorted, (value) => JSON.stringify(value));
      if (chain.plugins.has('define')) {
        chain
          .plugin('define')
          .tap(([options]) => [
            sortKeys({ ...result, ...options }, { deep: true }),
          ]);
      } else {
        const {
          default: { DefinePlugin },
        } = await import('webpack');

        chain.plugin('define').use(DefinePlugin, [result]);
      }
    }
  };
}

export const name = 'preset-env';
