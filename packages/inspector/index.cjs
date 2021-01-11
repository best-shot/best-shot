const action = require('./lib/action.cjs');

exports.command = 'inspect';

exports.describe = 'Output all configuration for inspection';

exports.builder = {
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

exports.handler = action;
