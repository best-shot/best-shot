const action = require('../lib/action');

exports.command = 'watch';

exports.describe = 'Same as `dev` command in watch mode';

exports.builder = (cli) =>
  cli.options({
    platform: {
      describe: 'Applicable platform',
      requiresArg: true,
      type: 'string',
    },
  });

exports.handler = action;
