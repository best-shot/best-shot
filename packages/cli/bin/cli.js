#!/usr/bin/env node

'use strict';

require('v8-compile-cache');

process.title = 'best-shot';

const yargs = require('yargs');
// @ts-ignore
const { green, cyan, supportsColor } = require('chalk');
const { commandEnv } = require('@best-shot/core/lib/common');
const action = require('../handle/action');
const addIgnore = require('./add-ignore');
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
  .demandCommand(1, "Won't work without a command")
  .command(
    'serve',
    'Same as `dev` command with dev server',
    setOptions.serve,
    action
  )
  .command(
    'watch',
    'Same as `dev` command in watch mode',
    setOptions.watch,
    action
  )
  .command(
    'dev',
    `Bundle files in ${cyan`Development mode`}`,
    setOptions.dev,
    action
  )
  .command(
    'prod',
    `Bundle files in ${cyan`Production mode`}`,
    setOptions.prod,
    action
  )
  .command('ignore', 'Add temporary directories to .*ignore', {}, addIgnore)
  .options({
    color: {
      default: Boolean(supportsColor.level),
      defaultDescription: 'supportsColor',
      describe: 'Colorful output',
      type: 'boolean'
    }
  })
  .middleware([
    function setEnv({ _: [command] }) {
      if (['dev', 'prod', 'watch', 'serve'].includes(command)) {
        process.env.NODE_ENV = commandEnv(command);
        console.log(cyan`NODE_ENV:`, process.env.NODE_ENV);
      }
    }
  ]);

installPkg(app);

// eslint-disable-next-line no-unused-expressions
app.argv;
