function wrap(cli, progress = false) {
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
  watch: cli => wrap(cli),
  dev: cli => wrap(cli, true),
  prod: cli =>
    wrap(cli, true).option('analyze', {
      describe: 'Generate bundle analyze',
      type: 'boolean',
      default: false
    })
};
