const { cyan } = require('chalk');

const { builder, handler } = require('./dev');

exports.command = 'prod';

exports.describe = `Bundle files in ${cyan('production')} mode`;

exports.builder = (cli) =>
  builder(cli).option('analyze', {
    describe: 'Generate bundle analyze',
    type: 'boolean',
    default: false,
  });

exports.handler = handler;
