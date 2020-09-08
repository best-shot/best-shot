#!/usr/bin/env node

const { cyan, red } = require('chalk');
const isInstalledGlobally = require('is-installed-globally');

if (isInstalledGlobally) {
  console.log(
    red('Error:'),
    "`@best-shot/cli` shouldn't be installed globally",
  );
  process.exit(1);
}

require('v8-compile-cache');

const Cheetor = require('cheetor');

const { commandEnv } = require('./lib/utils');

new Cheetor()
  .website('https://www.npmjs.com/org/best-shot')
  .commandSmart('@best-shot/dev-server/cmd/serve')
  .command('./cmd/watch')
  .command('./cmd/dev')
  .command('./cmd/prod')
  .commandSmart('@best-shot/analyzer/cmd/analyze')
  .commandSmart('@best-shot/inspector/cmd/inspect')
  .middleware([
    ({ _: [command] }) => {
      if (['dev', 'prod', 'watch', 'serve'].includes(command)) {
        process.env.NODE_ENV = commandEnv(command);

        console.log(cyan('NODE_ENV:'), process.env.NODE_ENV);
      }
    },
  ])
  .effect(({ scriptName }) => {
    process.title = scriptName;
  })
  // @ts-ignore
  .setup();
