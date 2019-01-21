function wrap(cli, progress = true) {
  return cli.options({
    platform: {
      describe: 'Applicable platform',
      default: 'webview',
      defaultDescription: 'webview',
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
  serve: cli =>
    wrap(cli, false).option('port', {
      describe: 'Specify a port number',
      requiresArg: true,
      type: 'number'
    }),
  prod: cli =>
    wrap(cli).option('analyze', {
      describe: 'Generate bundle analyze',
      type: 'boolean',
      default: false
    })
};
