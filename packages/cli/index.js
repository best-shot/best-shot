const { cyan } = require('chalk');
const Cheetor = require('cheetor');

const { commandMode } = require('./lib/utils');

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
      if (['dev', 'prod', 'watch', 'serve', 'analyze'].includes(command)) {
        process.env.NODE_ENV = commandMode(command);

        console.log(cyan('NODE_ENV:'), process.env.NODE_ENV);
      }
    },
  ])
  .effect(({ scriptName }) => {
    process.title = scriptName;
  })
  // @ts-ignore
  .setup();
