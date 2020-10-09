const { commandEnv, getCompiler, getConfig } = require('./utils');
const { reachConfig } = require('./reach');
const { applyProgress } = require('./apply');

const rootPath = process.cwd();

function handle(command, getConfigs) {
  if (command !== 'watch') {
    const { compiler, showStats } = getCompiler(getConfig);
    if (compiler) {
      compiler.run(showStats);
    }
  } else {
    const { compiler, showStats, watchOptions } = getCompiler(getConfigs);

    if (compiler) {
      compiler.watch(watchOptions, showStats);
    }
  }
}

module.exports = function action({ _: [command], platform, progress }) {
  handle(command, () => {
    const configFunc = reachConfig(rootPath);

    const { chain, presets = [], ...config } = configFunc({
      command,
      platform,
    });

    return getConfig({ presets })
      .load({
        options: {
          watch: command === 'watch',
        },
        mode: commandEnv(command),
        config,
        platform,
      })
      .when(typeof chain === 'function', chain)
      .when(progress, applyProgress)
      .toConfig();
  });
};
