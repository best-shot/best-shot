import extToRegexp from 'ext-to-regexp';

export function apply() {
  return async (chain) => {
    const mode = chain.get('mode');

    function set({ name, extname, ext, raw }) {
      const io = chain.module.rule(name).test(extToRegexp({ extname }));

      io.oneOf('url')
        .dependency('url')
        .generator.filename(
          mode === 'production'
            ? `[contenthash].${ext}`
            : `[path][name].${ext}`,
        );

      io.oneOf('not-url')
        .dependency({ not: 'url' })
        .oneOf('query')
        .resourceQuery(/to-url/)
        .type('asset/resource')
        .generator.filename(
          mode === 'production'
            ? `[contenthash].${ext}`
            : `[path][name].${ext}`,
        );

      io.oneOf('not-url').oneOf('raw').type(raw);
    }

    set({
      name: 'text',
      extname: ['txt'],
      ext: 'txt',
      raw: 'asset/source',
    });

    set({
      name: 'json',
      extname: ['json'],
      ext: 'json',
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
      .loader('yaml-loader')
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
