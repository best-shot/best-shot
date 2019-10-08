'use strict';

function wrap(cli, progress = true) {
  return cli.options({
    platform: {
      describe: 'Applicable platform',
      requiresArg: true,
      type: 'string'
    },
    ...(progress
      ? {
          progress: {
            describe: 'Show progress bar',
            default: true,
            type: 'boolean'
          }
        }
      : {}),
    custom: {
      describe: 'Object of custom arguments',
      default: {},
      requiresArg: true
    }
  });
}

module.exports = {
  watch: cli => wrap(cli, false),
  dev: cli => wrap(cli),
  serve: cli => wrap(cli, false),
  prod: cli =>
    wrap(cli).option('analyze', {
      describe: 'Generate bundle analyze',
      type: 'boolean',
      default: false
    })
};
