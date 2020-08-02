const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const extToRegexp = require('ext-to-regexp');
const autoprefixer = require('autoprefixer');

function applyOneOf({ auto = undefined, mode }) {
  return (rule) => {
    rule
      .use('css-loader')
      .loader('css-loader')
      .options({
        esModule: false,
        importLoaders: 2,
        localsConvention: 'camelCaseOnly',
        sourceMap: mode === 'development',
        modules: {
          ...(auto ? { auto } : undefined),
          localIdentName: {
            development: '[path][name]__[local]',
            production: '[local]_[hash:base64:8]',
          }[mode],
        },
      });
  };
}

module.exports = function applyStylesheet(chain) {
  chain.resolve.extensions.add('.css');

  const minimize = chain.optimization.get('minimize');

  if (minimize) {
    chain.optimization
      .minimizer('optimize-css-assets')
      .use(OptimizeCssAssetsPlugin, [
        {
          sourceMap: false,
          cssProcessorPluginOptions: {
            preset: [
              'default',
              {
                // mergeLonghand: false,
                discardComments: { removeAll: true },
              },
            ],
          },
        },
      ]);
  }

  chain.module.rule('style').test(extToRegexp({ extname: ['css'] }));

  const mode = chain.get('mode');
  const useHot = chain.devServer.get('hot') || false;

  chain.module
    .rule('style')
    .rule('css')
    .oneOf('css-modules-by-query')
    .resourceQuery(/module/)
    .batch(applyOneOf({ mode }));

  chain.module
    .rule('style')
    .rule('css')
    .oneOf('css-modules-by-filename')
    .batch(applyOneOf({ mode, auto: true }));

  const Autoprefixer = autoprefixer();
  // @ts-ignore
  // eslint-disable-next-line no-underscore-dangle
  Autoprefixer.__expression = 'autoprefixer()';

  chain.module
    .rule('style')
    .rule('postcss')
    .use('postcss-loader')
    .loader('postcss-loader')
    .options({
      sourceMap: mode === 'development',
      plugins: [Autoprefixer],
    });

  if (!useHot) {
    chain.plugin('extract-css').use(MiniCssExtractPlugin, [
      {
        filename: '[name].css',
        // chunkFilename: '[id].css',
        ignoreOrder: false,
      },
    ]);
  }

  chain.module.rule('style').when(
    useHot,
    (rule) => {
      rule
        .use('style-loader')
        .loader('style-loader')
        .options({ esModule: false });
    },
    (rule) => {
      rule.use('extract-css').loader(MiniCssExtractPlugin.loader).options({
        esModule: false,
        hmr: useHot,
        ignoreOrder: true,
        // reloadAll: false
      });
    },
  );
};
