const { cyan } = require('chalk');

const { handler, builder } = require('./watch.cjs');

exports.command = 'dev';

exports.describe = `Bundle files in ${cyan('development')} mode`;

exports.builder = (cli) => {
  builder(cli);

  cli.option('progress', {
    describe: 'Show progress bar',
    default: true,
    type: 'boolean',
    alias: 'p',
  });
};

exports.handler = handler;
