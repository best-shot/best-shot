const { cyan } = require('chalk');

const { builder, handler } = require('./watch');

exports.command = 'dev';

exports.describe = `Bundle files in ${cyan('development')} mode`;

exports.builder = (cli) =>
  builder(cli).option('progress', {
    describe: 'Show progress bar',
    default: true,
    type: 'boolean',
  });

exports.handler = handler;
