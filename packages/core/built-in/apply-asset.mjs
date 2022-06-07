import extToRegexp from 'ext-to-regexp';

export function apply() {
  return async (chain) => {
    const mode = chain.get('mode');

    function file(io) {
      io.set('generator', {
        filename:
          mode === 'production' ? '[contenthash:8][ext]' : '[path][name][ext]',
      });
    }

    function set(name, ext, raw = 'asset/source') {
      const io = chain.module.rule(name).test(extToRegexp({ extname: ext }));

      io.oneOf('url').set('dependency', 'url').batch(file);

      io.oneOf('not-url')
        .set('dependency', { not: 'url' })
        .oneOf('query')
        .resourceQuery(/to-url/)
        .type('asset/resource')
        .batch(file);

      io.oneOf('not-url').oneOf('raw').type(raw);
    }

    set('text', ['txt']);
    set('json', ['json'], 'json');

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
