#!/usr/bin/env node
const yargs = require('yargs');
const { green, cyan, supportsColor } = require('chalk');
const { EOL } = require('os');
const { terminalWidth } = require('yargs');
const { commandEnv, logRedError } = require('@best-shot/core/lib/common');
const action = require('../handle/action');
const setOptions = require('./set-options');
const installPkg = require('./install-pkg');

if (terminalWidth() >= 48) {
  console.log(green`
┌┐ ┌─┐┌─┐┌┬┐  ┌─┐┬ ┬┌─┐┌┬┐
├┴┐├┤ └─┐ │   └─┐├─┤│ │ │
└─┘└─┘└─┘ ┴   └─┘┴ ┴└─┘ ┴
`);
}

const app = yargs
  .scriptName('best-shot')
  // .epilogue('Website: https://airko.github.io/best-shot/')
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
    logRedError(msg || err);
    process.exit(1);
  })
  .check(({ _: commands }) => {
    if (commands.length > 1) {
      throw Error("Won't work when more than 1 command");
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
  .options({
    color: {
      default: Boolean(supportsColor.level),
      defaultDescription: 'supportsColor',
      describe: 'Print colorful output',
      type: 'boolean'
    },
    config: {
      normalize: true,
      describe: 'Config file path',
      default: 'best-shot.config.js',
      defaultDescription: cyan`best-shot.config.js`,
      requiresArg: true
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

installPkg(app, '../inspector/index');

// eslint-disable-next-line no-unused-expressions
app.argv;
