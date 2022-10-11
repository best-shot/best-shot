import chalk from 'chalk';

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

export const commands = {
  dev: 'development',
  serve: 'development',
  watch: 'development',
  prod: 'production',
  analyze: 'production',
};

export function commandMode(command) {
  return commands[command] || 'development';
}
