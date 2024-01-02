import extToRegexp from 'ext-to-regexp';
import slashToRegexp from 'slash-to-regexp';

function applyOneOf({ auto = false, mode }) {
  return (rule) => {
    rule
      .use('css-loader')
      .loader('css-loader')
      .options({
        importLoaders: 3,
        modules: {
          ...(auto ? { auto } : undefined),
          namedExport: true,
          localIdentName: {
            development: '[path][name]__[local]',
            production: '[local]_[hash:base64:8]',
          }[mode],
        },
      });
  };
}

export async function applyStylesheet(chain) {
  const minimize = chain.optimization.get('minimize');

  if (minimize) {
    const { default: CssMinimizerPlugin } = await import(
      'css-minimizer-webpack-plugin'
    );
    chain.optimization.minimizer('css-minimizer').use(CssMinimizerPlugin, [
      {
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      },
    ]);
  }

  chain.module
    .rule('style')
    .after('esm')
    .test(extToRegexp({ extname: ['css'] }))
    .rule('all')
    .oneOf('not-url')
    .dependency({ not: 'url' });

  const mode = chain.get('mode');
  const watch = chain.get('watch');
  const hot = chain.devServer.get('hot') || false;

  chain.module
    .rule('style')
    .rule('all')
    .oneOf('url')
    .dependency('url')
    .generator.filename('[contenthash:8].css');

  const parent = chain.module.rule('style').rule('all').oneOf('not-url');

  parent
    .oneOf('css-modules-by-query')
    .resourceQuery(/module/)
    .batch(applyOneOf({ mode }));

  parent
    .oneOf('css-modules-by-filename')
    .batch(applyOneOf({ mode, auto: true }));

  chain.module
    .rule('style')
    .rule('postcss')
    .use('postcss-loader')
    .loader('postcss-loader')
    .options({
      postcssOptions: {
        plugins: ['postcss-preset-evergreen'],
      },
    });

  if (hot) {
    parent.use('style-loader').loader('style-loader');
  } else {
    const { default: MiniCssExtractPlugin } = await import(
      'mini-css-extract-plugin'
    );

    parent.use('extract-css').loader(MiniCssExtractPlugin.loader);

    chain.plugin('extract-css').use(MiniCssExtractPlugin, [
      {
        filename: '[name].css',
        // chunkFilename: '[id].css',
        ignoreOrder: true,
      },
    ]);
  }

  if (!watch && chain.module.rules.has('babel')) {
    chain.module
      .rule('babel')
      .exclude.add(slashToRegexp('/node_modules/css-loader/'));

    if (!hot) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/mini-css-extract-plugin/'));
    }
  }
}
