import { inspect } from 'util';

import { Git } from '@nice-labs/git-rev/dist/git.js';
import chalk from 'chalk';
import flatten from 'flat';

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

  const data = mergeParams({ mode, serve, watch }, configObject);

  const empty = Object.keys(data).length === 0;

  if (!empty) {
    console.log(chalk.cyan('DEFINE/ENV'), pretty(data));
  }

  const GIT_HASH = getGitHash();

  return flatten(
    {
      BEST_SHOT: {
        ...(empty ? undefined : { ENV: data }),
        GIT_HASH,
      },
    },
    {
      safe: true,
      maxDepth: 3,
    },
  );
}
