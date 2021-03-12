const { errorHandle } = require('./utils.cjs');

module.exports = function action({ _: [command], progress, configName }) {
  errorHandle(async () => {
    const readConfig = require('./read-config.cjs');
    const createConfig = require('./create-config.cjs');
    const createCompiler = require('./create-compiler.cjs');

    const applyProgress = require('./apply-progress.cjs');

    const configs = await readConfig()({ command, configName });

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
