'use strict';

function wrap(cli, progress = true) {
  return cli.options({
    platform: {
      describe: 'Applicable platform',
      requiresArg: true,
      type: 'string'
    },
    progress: {
      describe: 'Show progress bar',
      default: progress,
      type: 'boolean'
    },
    custom: {
      describe: 'Object of custom arguments',
      default: {},
      requiresArg: true
    }
  });
}

module.exports = {
  watch: cli => wrap(cli),
  dev: cli => wrap(cli),
  serve: cli => wrap(cli, false),
  prod: cli =>
    wrap(cli).option('analyze', {
      describe: 'Generate bundle analyze',
      type: 'boolean',
      default: false
    })
};
