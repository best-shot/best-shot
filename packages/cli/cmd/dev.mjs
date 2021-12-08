import { builder as baseBuilder } from './watch.mjs';

export const command = 'dev';

export const describe = 'Bundle files in development mode';

export function builder(cli) {
  baseBuilder(cli);

  cli.option('progress', {
    describe: 'Show progress bar',
    default: true,
    type: 'boolean',
    alias: 'p',
  });
}

export { handler } from './watch.mjs';
