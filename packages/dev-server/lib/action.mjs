import { commandMode, errorHandle } from '@best-shot/cli/lib/utils.mjs';
import chalk from 'chalk';

const { cyan } = chalk;

export function action({ _: [command], configName }) {
  errorHandle(async () => {
    const { readConfig } = await import('@best-shot/config');
    const { createConfig } = await import(
      '@best-shot/cli/lib/create-config.mjs'
    );
    const { createCompiler } = await import(
      '@best-shot/cli/lib/create-compiler.mjs'
    );

    const mode = commandMode(command);

    const configs = await readConfig()({ mode, command, configName });

    const result = [];

    for (const config of configs) {
      const io = await createConfig(config, {
        watch: true,
        mode,
        serve: Boolean(config.devServer),
      });
      result.push(io);
    }

    const shouldServe = [];
    const shouldWatch = [];

    result.forEach((config) => {
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

      const watchOptions = shouldWatch.map(
        (config) => config.watchOptions || {},
      );
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
      const { DevServer } = await import('./server.mjs');

      process.env.WEBPACK_DEV_SERVER_BASE_PORT = 1234;

      shouldServe.forEach((config) => {
        const compiler = createCompiler(config);
        const instance = new DevServer(config.devServer, compiler);

        instance.start();
      });
    }
  });
}
