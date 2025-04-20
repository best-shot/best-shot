import { execFileSync } from 'node:child_process';
import { inspect } from 'node:util';

import chalk from 'chalk';

import { findConfig, mergeParams } from './lib.mjs';

export function pretty(data) {
  const empty = Object.keys(data).length === 0;

  if (!empty) {
    console.log(
      chalk.cyan('DEFINE/ENV'),
      inspect(data, {
        compact: false,
        colors: Boolean(chalk.level),
        breakLength: 80,
        depth: 20,
      }),
    );
  }
}

export function getEnv({ root, mode, serve, watch }) {
  const { filePath, config } = findConfig(root);

  const envs = mergeParams({ mode, serve, watch }, config);

  return { filePath, envs };
}

export function getGitHash() {
  try {
    return (
      execFileSync('git', ['rev-parse', 'HEAD'], {
        encoding: 'utf8',
      }).trim() || 'noop'
    );
  } catch {
    return 'noop';
  }
}
