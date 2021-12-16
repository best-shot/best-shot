import { inspect } from 'util';

import { Git } from '@nice-labs/git-rev/dist/git.js';
import chalk from 'chalk';

import { findConfig, mergeParams, parseConfig } from './lib.mjs';

function getGitHash() {
  try {
    return new Git().commitHash();
  } catch {
    return 'noop';
  }
}

function pretty(data) {
  return inspect(data, {
    compact: false,
    colors: Boolean(chalk.level),
    breakLength: 80,
    depth: 20,
  });
}

export function getEnv(root, { mode, serve, watch }) {
  const configFile = findConfig(root);

  const configObject = parseConfig(configFile);

  const GIT_HASH = getGitHash();

  configObject.GIT_HASH = GIT_HASH;

  const data = mergeParams({ mode, serve, watch }, configObject);

  console.log(chalk.gyan('ENV'), pretty(data));

  return Object.keys(data).length > 0 ? data : undefined;
}
