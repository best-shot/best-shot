function commandEnv(command) {
  return (
    {
      dev: 'development',
      serve: 'development',
      watch: 'development',
      prod: 'production',
      analyze: 'production',
    }[command] || 'development'
  );
}

function getCompiler(getConfigs) {
  const config = getConfigs();

  function showStats(error, stats) {
    if (error) {
      console.error(error);
    }
    if (stats) {
      if (stats.hasErrors()) {
        process.exitCode = 1;
      }

      console.log(stats.toString(config.stats));
    }
  }

  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  const compiler = webpack(config);

  const { watchOptions, devServer } = config;

  return { compiler, showStats, watchOptions, devServer };
}

function getConfig({ name, presets }) {
  // eslint-disable-next-line global-require
  const BestShot = require('@best-shot/core');
  return new BestShot({ name, presets });
}

module.exports = {
  commandEnv,
  getCompiler,
  getConfig,
};
