const { cyan, green } = require('chalk');
const Cheetor = require('cheetor');

const { commandMode, commands } = require('./lib/utils.cjs');

new Cheetor()
  .website('https://www.npmjs.com/org/best-shot')
  .commandSmart('@best-shot/dev-server')
  .command('./cmd/watch.cjs')
  .command('./cmd/dev.cjs')
  .command('./cmd/prod.cjs')
  .commandSmart('@best-shot/analyzer')
  .commandSmart('@best-shot/inspector')
  .middleware([
    ({ _: [command = 'dev'] }) => {
      console.log(cyan('BEST-SHOT:'), command, '-'.repeat(20));
      if (Object.keys(commands).includes(command)) {
        process.env.NODE_ENV = commandMode(command);
        console.log(green('MODE/NODE_ENV:'), process.env.NODE_ENV);
      }
    },
  ])
  .effect(({ scriptName }) => {
    process.title = scriptName;
  })
  // @ts-ignore
  .setup();
