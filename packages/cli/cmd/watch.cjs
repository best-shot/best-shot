const action = require('../lib/action.cjs');

exports.command = 'watch';

exports.describe = 'Same as `dev` command in watch mode';

exports.builder = (cli) => {
  cli.option('config-name', {
    describe: 'Name for multi config',
    alias: 'n',
    type: 'string',
    coerce: (value) => (value ? value.trim() : undefined),
    requiresArg: true,
  });
};

exports.handler = action;
