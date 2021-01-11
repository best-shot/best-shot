const { errorHandle } = require('@best-shot/cli/lib/utils.cjs');

module.exports = function action({ _: [command] }) {
  errorHandle(async () => {
    const readConfig = require('@best-shot/cli/lib/read-config.cjs');
    const createConfig = require('@best-shot/cli/lib/create-config.cjs');
    const createCompiler = require('@best-shot/cli/lib/create-compiler.cjs');

    const applyAnalyzer = require('./apply.cjs');

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

    compiler.run(showStats);
  });
};
