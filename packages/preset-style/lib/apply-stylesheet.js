const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

function applyOneOf({ auto, mode }) {
  return (rule) => {
    rule
      .use('css-loader')
      .loader('css-loader')
      .options({
        esModule: false,
        importLoaders: 3,
        modules: {
          ...(auto ? { auto } : undefined),
          exportLocalsConvention: 'camelCaseOnly',
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
          sourceMap: !['eval', false].includes(chain.get('devtool')),
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

  chain.module
    .rule('style')
    .rule('postcss')
    .use('postcss-loader')
    .loader('postcss-loader')
    .options({
      postcssOptions: {
        plugins: ['autoprefixer', 'postcss-selector-not'],
      },
    });

  if (!useHot) {
    chain.plugin('extract-css').use(MiniCssExtractPlugin, [
      {
        filename: '[name].css',
        // chunkFilename: '[id].css',
        ignoreOrder: true,
      },
    ]);
  }

  if (chain.module.rules.has('babel')) {
    chain.module
      .rule('babel')
      .exclude.add(slashToRegexp('/node_modules/css-loader/'))
      .when(!useHot, (exclude) =>
        exclude.add(slashToRegexp('/node_modules/mini-css-extract-plugin/')),
      );
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
      rule
        .use('extract-css')
        .loader(MiniCssExtractPlugin.loader)
        .options({ esModule: false });
    },
  );
};
