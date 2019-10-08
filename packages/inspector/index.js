'use strict';

const inspector = require('./lib/action');

exports.command = 'inspect';

exports.describe = 'Output all configuration for inspection';

exports.builder = {
  platforms: {
    coerce(values) {
      if (values.length === 0) {
        throw new Error('Not enough platforms arguments');
      }
      return values;
    },
    describe: 'Applicable platforms',
    type: 'array'
  },
  stamp: {
    coerce(value) {
      return value === 'auto' ? new Date().getTime().toString() : value;
    },
    default: '',
    describe: 'Markup of output files',
    requiresArg: true,
    type: 'string'
  }
};

exports.handler = inspector;
