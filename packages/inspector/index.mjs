export const command = 'inspect';

export const describe = 'Output all configuration for inspection';

export const builder = {
  stamp: {
    coerce(value) {
      return value === 'auto' ? Date.now().toString() : value;
    },
    default: 'auto',
    describe: 'Markup of output files',
    requiresArg: true,
    type: 'string',
  },
};

export { action as handler } from './lib/action.mjs';
