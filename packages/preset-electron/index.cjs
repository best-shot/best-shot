const { HotModuleReplacementPlugin } = require('webpack');
const NodeHmrPlugin = require('node-hmr-plugin');
const slash = require('slash');

exports.apply = function apply() {
  return (config) => {
    if (['electron-main', 'electron-renderer'].includes(config.get('target'))) {
      config.node.merge({ __dirname: false, __filename: false });
    }

    if (config.get('target') === 'electron-main') {
      config.output.libraryTarget('commonjs2');

      // config.module
      //   .rule('node')
      //   .test(extToRegexp({ extname: ['node'] }))
      //   .use('node-loader')
      //   .loader('node-loader');

      if (config.get('watch')) {
        config.plugin('hmr-caller').use(HotModuleReplacementPlugin);
        config.plugin('electron-caller').use(NodeHmrPlugin, [
          {
            cmd: `${slash(require.resolve('electron/cli.js'))} {app}`,
            restartOnExitCodes: [1, 99],
          },
        ]);

        Object.entries(config.entryPoints.entries()).forEach(([key]) => {
          config
            .entry(key)
            .prepend('webpack/hot/poll?5000')
            .prepend('@best-shot/preset-electron/reboot.cjs');
        });
      }
    }
  };
};
