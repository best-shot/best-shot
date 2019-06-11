#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const { green, cyan, supportsColor } = require('chalk');
const { EOL } = require('os');
const { commandEnv, logRedError } = require('@best-shot/core/lib/common');
const action = require('../handle/action');
const addIgnore = require('../handle/add-ignore');
const setOptions = require('./set-options');
const installPkg = require('./install-pkg');

const app = yargs
  .scriptName('best-shot')
  .epilogue('Website: https://github.com/airkro/best-shot')
  .usage(`Usage: ${green`$0`} <command> [options]`)
  .describe('help', 'Show help information')
  .alias('help', 'h')
  .version(false)
  .wrap(75)
  .locale('en')
  .strict()
  .parserConfiguration({ 'duplicate-arguments-array': true })
  .fail((msg, err, cli) => {
    console.log(cli.help(), EOL);
    logRedError(msg, err);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  })
  .check(({ _: commands }) => {
    if (commands.length > 1) {
      throw new Error("Won't work when more than 1 command");
    }
    return true;
  })
  .demandCommand(1, "Won't work without a command")
  .command(
    'serve',
    'Same as `dev` command, and starts a local dev server',
    setOptions.serve,
    action
  )
  .command(
    'watch',
    'Same as `dev` command, and watch source code changes',
    setOptions.watch,
    action
  )
  .command(
    'dev',
    `Bundle files in ${cyan`Development mode`}, with sourcemaps`,
    setOptions.dev,
    action
  )
  .command(
    'prod',
    `Bundle files in ${cyan`Production mode`}, with minification`,
    setOptions.prod,
    action
  )
  .command(
    'ignore',
    'add .best-shot temporary directory to ignore files',
    {},
    addIgnore
  )
  .options({
    color: {
      default: Boolean(supportsColor.level),
      defaultDescription: 'supportsColor',
      describe: 'Print colorful output',
      type: 'boolean'
    }
  })
  .middleware([
    function setEnv({ _: [command] }) {
      if (['dev', 'prod', 'watch', 'serve'].includes(command)) {
        process.env.NODE_ENV = commandEnv(command);
        console.log(cyan`NODE_ENV:`, process.env.NODE_ENV + EOL);
      }
    }
  ]);

installPkg(app);

// eslint-disable-next-line no-unused-expressions
app.argv;
