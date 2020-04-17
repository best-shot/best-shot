const watcher = require('chokidar-watcher');
const debounce = require('lodash/debounce');

function getCompiler(getConfig) {
  const { watch, watchOptions, stats, devServer, ...config } = getConfig();

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

module.exports = function handle(command, getConfig) {
  if (command !== 'serve' && command !== 'watch') {
    const { compiler, showStats } = getCompiler(getConfig);
    compiler.run(showStats);
  } else {
    let instance;

    const runner = debounce(
      () => {
        if (instance) {
          instance.close(() => {
            console.log('Configuration change, rebooting...');
          });
        }

        const { compiler, showStats, watchOptions, devServer } = getCompiler(
          getConfig,
        );

        if (command === 'serve') {
          // eslint-disable-next-line global-require, import/no-extraneous-dependencies, node/no-extraneous-require
          const DevServer = require('@best-shot/dev-server/lib/server');

          instance = DevServer(compiler, devServer);
        } else {
          instance = compiler.watch(watchOptions, showStats);
        }
      },
      3000,
      { trailing: true },
    );

    watcher(
      // @ts-ignore
      [
        '.best-shot/{config,custom,diy}/*',
        '.best-shot/{config,env,preset,plugin,tool}.*',
        '.{babel,postcss,browserslist}rc',
        '.{babel,postcss}rc.json',
        'browserslist',
        'package.json',
        '{babel,postcss}.config.*',
        '{js,ts}config.json',
      ],
      {
        cwd: process.cwd(),
        awaitWriteFinish: true,
      },
      {
        add: runner,
        change: runner,
        rename: runner,
        unlink: runner,
      },
    );
  }
};
