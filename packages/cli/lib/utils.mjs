import chalk from 'chalk';
import { execSync } from 'node:child_process';

const { red } = chalk;

export async function errorHandle(callback) {
  try {
    await callback();
  } catch (error) {
    console.log(red(`${error.name}:`), error.message);

    if (error.detail) {
      console.log(error.detail);
    }

    if (error.stack) {
      console.log(error.stack);
    }

    process.exitCode = 1;
  }
}

const branches = {
  master: 'production',
  main: 'production',
  release: 'production',
};

function getBranch() {
  return (
    process.env.BRANCH_NAME ||
    execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
  );
}

export const commands = {
  dev: 'development',
  serve: 'development',
  watch: 'development',
  prod: 'production',
  analyze: 'production',
  get auto() {
    const branch = getBranch();
    return branches[branch] || 'development';
  },
};

export function commandMode(command) {
  return commands[command] || 'development';
}
