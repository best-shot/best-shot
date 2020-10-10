const { getCompiler, getConfig } = require('@best-shot/cli/lib/utils');
const { reachConfig } = require('@best-shot/cli/lib/reach');
const apply = require('./apply');

const rootPath = process.cwd();

function handle(getConfigs) {
  const { compiler, showStats } = getCompiler(getConfigs);
  if (compiler) {
    compiler.run(showStats);
  }
}

module.exports = function action({ _: [command], platform }) {
  handle(() => {
    const configFunc = reachConfig(rootPath);

    const { chain, presets = [], ...config } = configFunc({
      command,
      platform,
    });

    return getConfig({ presets })
      .load({
        options: {
          watch: false,
        },
        mode: 'production',
        config,
        platform,
      })
      .when(typeof chain === 'function', chain)
      .batch(apply)
      .toConfig();
  });
};
