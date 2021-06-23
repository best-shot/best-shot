export const command = 'serve';

export const describe = 'Same as `dev` command with `dev-server`';

export { action as handler } from './lib/action.mjs';

export { builder } from '@best-shot/cli/cmd/watch.mjs';
