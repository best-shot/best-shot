function commandEnv(command) {
  return (
    {
      dev: 'development',
      serve: 'development',
      watch: 'development',
      prod: 'production',
    }[command] || 'development'
  );
}

function getCompiler(getConfig) {
  const config = getConfig();

  const { watchOptions, stats, devServer } = config;

  function showStats(error, Stats) {
    if (error) {
      console.error(error);
    }
    if (Stats) {
      console.log(Stats.toString(stats));
    }
  }

  // eslint-disable-next-line global-require
  const webpack = require('webpack');
  const compiler = webpack(config);

  return { compiler, showStats, watchOptions, devServer };
}

module.exports = {
  commandEnv,
  getCompiler,
};
