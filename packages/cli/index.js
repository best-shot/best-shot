#!/usr/bin/env node

require('v8-compile-cache');

process.title = 'best-shot';

const yargs = require('yargs');
const { green, cyan, level } = require('chalk');

const { commandEnv } = require('./lib/utils');
const action = require('./lib/action');
const setOptions = require('./lib/set-options');

function findPkg(pkg) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(pkg);
  } catch (error) {
    return { command: '' };
  }
}

// eslint-disable-next-line no-unused-expressions
yargs
  .scriptName('best-shot')
  .epilogue('Repository: https://github.com/best-shot/best-shot')
  .epilogue('Website: https://www.npmjs.com/org/best-shot')
  .usage(`Usage: ${green`$0`} <command> [options]`)
  .alias('help', 'h')
  .version(false)
  .wrap(60)
  .detectLocale(false)
  .strict()
  .demandCommand(1, "Won't work without a command")
  .command(findPkg('@best-shot/dev-server'))
  .command(
    'watch',
    'Same as `dev` command in watch mode',
    setOptions.watch,
    action,
  )
  .command(
    'dev',
    `Bundle files in ${cyan`development`} mode`,
    setOptions.dev,
    action,
  )
  .command(
    'prod',
    `Bundle files in ${cyan`production`} mode`,
    setOptions.prod,
    action,
  )
  .command(findPkg('@best-shot/inspector'))
  .command(findPkg('./lib/add-ignore'))
  .option('color', {
    coerce: () => level > 0,
    describe: 'Colorful output',
    type: 'boolean',
  })
  .middleware([
    function setEnv({ _: [command] }) {
      if (['dev', 'prod', 'watch', 'serve'].includes(command)) {
        process.env.NODE_ENV = commandEnv(command);

        console.log(cyan`NODE_ENV:`, process.env.NODE_ENV);
      }
    },
  ]).argv;
