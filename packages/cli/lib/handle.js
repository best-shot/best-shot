const webpack = require('webpack');

module.exports = function handle(command, chain) {
  const { watch, watchOptions, stats, devServer, ...config } = chain.toConfig();

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function showStats(error, Stats) {
    if (error) {
      console.error(error);
    }
    if (Stats) {
      console.log(Stats.toString(stats));
    }
  }

  const compiler = webpack(config);

  if (command === 'serve') {
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies, node/no-extraneous-require
    const DevServer = require('@best-shot/dev-server/lib/server');

    DevServer(compiler, devServer);
  } else if (command === 'watch') {
    compiler.watch(watchOptions, showStats);
  } else {
    compiler.run(showStats);
  }
};
