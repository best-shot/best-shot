const { watch: Watcher } = require('chokidar');
const debounce = require('lodash/debounce');

const { getCompiler } = require('./utils');

module.exports = function handle(command, getConfig) {
  if (command !== 'serve' && command !== 'watch') {
    const { compiler, showStats } = getCompiler(getConfig);
    compiler.run(showStats);
  } else {
    console.log('`best-shot` is watching your configuration');

    let instance;

    const runner = () => {
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
    };

    const action = debounce(runner, 3000, { trailing: true });

    // eslint-disable-next-line global-require
    const globs = require('./globs.json');

    Watcher(globs, {
      cwd: process.cwd(),
      awaitWriteFinish: true,
      ignored: ['**/node_modules', '**/.git', '**/.svn'],
    }).on('all', action);
  }
};
