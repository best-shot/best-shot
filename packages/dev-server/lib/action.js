const { getCompiler, getConfig } = require('@best-shot/cli/lib/utils');
const { reachConfig } = require('@best-shot/cli/lib/reach');

const rootPath = process.cwd();

function handle(getConfigs) {
  const { compiler, devServer } = getCompiler(getConfigs);

  if (compiler) {
    // eslint-disable-next-line global-require
    const DevServer = require('..');
    DevServer(compiler, devServer);
  }
}

module.exports = function action({ _: [command], platform }) {
  handle(() => {
    const configFunc = reachConfig(rootPath);

    const { chain, presets = [], ...config } = configFunc({
      command,
      platform,
    });

    return getConfig({ presets: ['serve', ...presets] })
      .load({
        options: {
          watch: true,
        },
        mode: 'development',
        config,
        platform,
      })
      .when(typeof chain === 'function', chain)
      .toConfig();
  });
};
