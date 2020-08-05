const { red } = require('chalk');

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
  try {
    const config = getConfig();

    // eslint-disable-next-line no-inner-declarations
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
  } catch (error) {
    console.log(red('Error:', error.message));
    process.exitCode = 1;
    return {};
  }
}

module.exports = {
  commandEnv,
  getCompiler,
};
