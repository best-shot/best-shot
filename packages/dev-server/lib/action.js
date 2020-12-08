/* eslint-disable global-require */
const { cyan } = require('chalk');
const { errorHandle } = require('@best-shot/cli/lib/utils');

module.exports = function action({ _: [command] }) {
  errorHandle(function main() {
    const readConfig = require('@best-shot/cli/lib/read-config');
    const createConfig = require('@best-shot/cli/lib/create-config');
    const createCompiler = require('@best-shot/cli/lib/create-compiler');

    const configs = readConfig()({ command });

    const { autoAddPreset } = require('./utils');

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

      const compiler = createCompiler(result);

      const { watchOptions } =
        result.find((config) => config.watchOptions) || {};
      const { stats: statsConfig } = result.find(({ stats }) => stats) || {};

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
      const DevServer = require('..');

      shouldServe.forEach(({ devServer }) => {
        const compiler = createCompiler(result);
        DevServer(compiler, devServer);
      });
    }
  });
};
