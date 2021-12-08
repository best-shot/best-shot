import { errorHandle } from '@best-shot/cli/lib/utils.mjs';

export function action({ _: [command] }) {
  errorHandle(async () => {
    const { readConfig } = await import('@best-shot/config');
    const { createConfig } = await import(
      '@best-shot/cli/lib/create-config.mjs'
    );
    const { createCompiler } = await import(
      '@best-shot/cli/lib/create-compiler.mjs'
    );

    const { applyAnalyzer } = await import('./apply.mjs');

    const configs = await readConfig()({ command });

    const result = configs.map((config) =>
      createConfig(config, {
        command,
        batch: applyAnalyzer,
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

    compiler.run((error, stats) => {
      showStats(error, stats);
      compiler.close((exitError) => {
        if (exitError) {
          throw exitError;
        }
      });
    });
  });
}
