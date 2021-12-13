import { createRequire } from 'module';

import slash from 'slash';

const require = createRequire(import.meta.url);

export function apply() {
  return async (config) => {
    if (['electron-main'].includes(config.get('target'))) {
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
        const {
          default: { HotModuleReplacementPlugin },
        } = await import('webpack');

        config.plugin('hmr-caller').use(HotModuleReplacementPlugin);

        const { default: NodeHmrPlugin } = await import('node-hmr-plugin');

        config.plugin('electron-caller').use(NodeHmrPlugin, [
          {
            cmd: `${slash(require.resolve('electron/cli.js'))} {app}`,
          },
        ]);

        Object.entries(config.entryPoints.entries()).forEach(([key]) => {
          config
            .entry(key)
            .prepend('webpack/hot/poll?5000')
            .prepend('@best-shot/preset-electron/reboot.mjs');
        });
      }
    }
  };
}
