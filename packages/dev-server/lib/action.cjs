const { cyan } = require('chalk');
const { errorHandle } = require('@best-shot/cli/lib/utils.cjs');

module.exports = function action({ _: [command] }) {
  errorHandle(async () => {
    const readConfig = require('@best-shot/cli/lib/read-config.cjs');
    const createConfig = require('@best-shot/cli/lib/create-config.cjs');
    const createCompiler = require('@best-shot/cli/lib/create-compiler.cjs');

    const configs = await readConfig()({ command });

    const { autoAddPreset } = require('./utils.cjs');

    autoAddPreset(configs);

    const result = configs.map((config) =>
      // @ts-ignore
      createConfig(config, {
        watch: true,
        command,
      }),
    );

    const shouldServe = [];
    const shouldWatch = [];

    result.forEach((config) => {
      // @ts-ignore
      if (config.devServer) {
        shouldServe.push(config);
      } else {
        shouldWatch.push(config);
      }
    });

    if (shouldWatch.length > 0) {
      console.log(
        cyan('Tips:'),
        'some configurations have been fallback to watch mode',
      );

      const compiler = createCompiler(shouldWatch);

      const { watchOptions } =
        shouldWatch.find((config) => config.watchOptions) || {};
      const { stats: statsConfig } =
        shouldWatch.find(({ stats }) => stats) || {};

      // eslint-disable-next-line no-inner-declarations
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

      compiler.watch(watchOptions, showStats);
    }

    if (shouldServe.length > 0) {
      const DevServer = require('./server.cjs');

      shouldServe.forEach((config) => {
        const compiler = createCompiler(config);
        DevServer(compiler, config.devServer);
      });
    }
  });
};
