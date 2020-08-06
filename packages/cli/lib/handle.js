const { getCompiler } = require('./utils');

module.exports = function handle(command, getConfig) {
  if (command !== 'serve' && command !== 'watch') {
    const { compiler, showStats } = getCompiler(getConfig);
    if (compiler) {
      compiler.run(showStats);
    }
  } else {
    const { compiler, showStats, watchOptions, devServer } = getCompiler(
      getConfig,
    );

    if (compiler) {
      if (command === 'serve') {
        // eslint-disable-next-line global-require, import/no-extraneous-dependencies
        const DevServer = require('@best-shot/dev-server/lib/server');
        DevServer(compiler, devServer);
      } else {
        compiler.watch(watchOptions, showStats);
      }
    }
  }
};
