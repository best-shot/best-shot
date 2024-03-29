import { execFileSync } from 'node:child_process';
import { inspect } from 'node:util';

import chalk from 'chalk';
import { flatten } from 'flat';

import { findConfig, mergeParams, parseConfig } from './lib.mjs';

export function getGitHash() {
  try {
    return (
      execFileSync('git', ['rev-parse', 'HEAD'], {
        encoding: 'utf8',
      }).trim() || 'noop'
    );
    // eslint-disable-next-line unicorn/prefer-optional-catch-binding
  } catch (_) {
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
      'import.meta.env': {
        ...(empty ? undefined : data),
        GIT_HASH,
      },
    },
    {
      safe: true,
      maxDepth: 3,
    },
  );
}
