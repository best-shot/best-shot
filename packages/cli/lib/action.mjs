import { errorHandle } from './utils.mjs';

export function action({ _: [command], progress, configName }) {
  errorHandle(async () => {
    const { readConfig } = await import('@best-shot/config');
    const { createConfig } = await import('./create-config.mjs');
    const { createCompiler } = await import('./create-compiler.mjs');
    const { applyProgress } = await import('./apply-progress.mjs');

    const configs = await readConfig()({ command, configName });

    const result = [];

    for (const config of configs) {
      const io = await createConfig(config, {
        watch: command === 'watch',
        command,
        batch: progress ? applyProgress : undefined,
      });
      result.push(io);
    }

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

    if (command === 'watch') {
      const { watchOptions } =
        result.find((config) => config.watchOptions) || {};
      compiler.watch(watchOptions, showStats);
    } else {
      compiler.run((error, stats) => {
        showStats(error, stats);
        compiler.close((exitError) => {
          if (exitError) {
            throw exitError;
          }
        });
      });
    }
  });
}
