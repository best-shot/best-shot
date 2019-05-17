'use strict';

const inspector = require('./action');

exports.command = 'inspect';

exports.describe = 'Output all webpack configuration files for inspection';

exports.builder = {
  platforms: {
    coerce: arr => {
      if (!Array.isArray(arr)) {
        throw new TypeError('Argument platforms should be an Array');
      }
      if (arr.length === 0) {
        throw new Error('Not enough arguments following: platforms');
      }
      return arr;
    },
    describe: 'Applicable platforms',
    default: ['webview'],
    defaultDescription: '[webview]',
    type: 'array'
  },
  stamp: {
    coerce: value => value || new Date().getTime().toString(),
    default: '',
    defaultDescription: 'timestamp',
    describe: 'Markup of output files',
    requiresArg: true,
    type: 'string'
  }
};

exports.handler = inspector;
