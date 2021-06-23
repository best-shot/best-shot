import chalk from 'chalk';
import { Cheetor } from 'cheetor';

import { commandMode, commands } from './lib/utils.mjs';

const { cyan, green } = chalk;

export function action() {
  new Cheetor('../package.json', import.meta.url)
    .website('https://www.npmjs.com/org/best-shot')
    .commandSafe('@best-shot/dev-server')
    .commandFrom('../cmd/watch.mjs')
    .commandFrom('../cmd/dev.mjs')
    .commandFrom('../cmd/prod.mjs')
    .commandSafe('@best-shot/analyzer')
    .commandSafe('@best-shot/inspector')
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
    .setup();
}
