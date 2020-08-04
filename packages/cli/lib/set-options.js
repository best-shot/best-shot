function wrap(cli, progress = false) {
  if (progress) {
    cli.option('progress', {
      describe: 'Show progress bar',
      default: true,
      type: 'boolean',
    });
  }

  return cli.options({
    platform: {
      describe: 'Applicable platform',
      requiresArg: true,
      type: 'string',
    },
  });
}

module.exports = {
  watch: (cli) => wrap(cli),
  dev: (cli) => wrap(cli, true),
  prod: (cli) =>
    wrap(cli, true).option('analyze', {
      describe: 'Generate bundle analyze',
      type: 'boolean',
      default: false,
    }),
};
