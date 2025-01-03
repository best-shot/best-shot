import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

export function apply() {
  return async (chain) => {
    const assetModuleFilename = chain.output.get('assetModuleFilename');

    function set({ name, extname, ext, raw }) {
      const io = chain.module.rule(name).test(extToRegexp({ extname }));

      io.oneOf('url').dependency('url');

      io.oneOf('with').with({ type: 'url' }).type('asset/resource');

      if (ext) {
        io.oneOf('url').generator.filename(
          assetModuleFilename.replace('[ext]', `.${ext}`),
        );

        io.oneOf('with').generator.filename(
          assetModuleFilename.replace('[ext]', `.${ext}`),
        );
      }

      io.oneOf('not-url').oneOf('raw').type(raw);
    }

    set({
      name: 'text',
      extname: ['txt'],
      raw: 'asset/source',
    });

    set({
      name: 'json',
      extname: ['json'],
      raw: 'json',
    });

    set({
      name: 'yaml',
      extname: ['yaml', 'yml'],
      ext: 'json',
      raw: 'json',
    });

    chain.module
      .rule('yaml')
      .use('yaml-loader')
      .loader(fileURLToPath(import.meta.resolve('yaml-loader')))
      .options({ asJSON: true });

    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      const { default: JsonMinimizerPlugin } = await import(
        'json-minimizer-webpack-plugin'
      );

      chain.optimization.minimizer('json').use(JsonMinimizerPlugin);
    }
  };
}

export const name = 'asset-next';
