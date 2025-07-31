import { readFileSync } from 'node:fs';

import chalk from 'chalk';
import { Cheetor } from 'cheetor';

import * as clear from '../cmd/clear.mjs';
import * as dev from '../cmd/dev.mjs';
import * as prod from '../cmd/prod.mjs';
import * as auto from '../cmd/auto.mjs';
import * as watch from '../cmd/watch.mjs';
import { commandMode, commands } from '../lib/utils.mjs';

export function create() {
  const { cyan, green } = chalk;

  const current = import.meta.url;
  const file = new URL('../package.json', current);
  const raw = readFileSync(file);
  const pkg = JSON.parse(raw);

  new Cheetor(pkg, current)
    .website('https://www.npmjs.com/org/best-shot')
    .commandSafe('@best-shot/dev-server')
    .command(watch)
    .command(dev)
    .command(prod)
    .command(auto)
    .command(clear)
    .commandSafe('@best-shot/analyzer')
    .commandSafe('@best-shot/inspector')
    .middleware([
      ({ _: [command = 'dev'] }) => {
        console.log(cyan('BEST-SHOT:'), command, '-'.repeat(20));

        if (command in commands) {
          process.env.NODE_ENV = commandMode(command);
          console.log(green('MODE/NODE_ENV:'), process.env.NODE_ENV);
        }
      },
    ])
    .setup();
}
