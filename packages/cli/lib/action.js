/* eslint-disable global-require */

const { errorHandle } = require('./utils');

module.exports = function action({ _: [command], progress }) {
  errorHandle(function main() {
    const readConfig = require('./read-config');
    const createConfig = require('./create-config');
    const createCompiler = require('./create-compiler');

    const applyProgress = require('./apply-progress');

    const configs = readConfig()({ command });

    const result = configs.map((config) =>
      createConfig(config, {
        watch: command === 'watch',
        command,
        batch: progress ? applyProgress : undefined,
      }),
    );

    const { stats: statsConfig } = result.find(({ stats }) => stats) || {};

    function showStats(error, stats) {
      if (error) {
        console.error(error);
        process.exitCode = 1;
      }
      if (stats) {
        if (stats.hasErrors()) {
          process.exitCode = 1;
        }

        console.log(stats.toString(statsConfig));
      }
    }

    const compiler = createCompiler(result);

    if (command !== 'watch') {
      compiler.run(showStats);
    } else {
      const { watchOptions } =
        result.find((config) => config.watchOptions) || {};
      compiler.watch(watchOptions, showStats);
    }
  });
};
