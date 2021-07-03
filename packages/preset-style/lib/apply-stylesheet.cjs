'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

function applyOneOf({ auto = false, esModule = true, mode }) {
  return (rule) => {
    rule
      .use('css-loader')
      .loader('css-loader')
      .options({
        ...(!esModule ? { esModule: false } : undefined),
        importLoaders: 3,
        modules: {
          ...(auto ? { auto } : undefined),
          ...(esModule
            ? { namedExport: true }
            : { exportLocalsConvention: 'camelCaseOnly' }),
          localIdentName: {
            development: '[path][name]__[local]',
            production: '[local]_[hash:base64:8]',
          }[mode],
        },
      });
  };
}

module.exports = function applyStylesheet(esModule = true) {
  return (chain) => {
    chain.resolve.extensions.add('.css');

    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      chain.optimization.minimizer('css-minimizer').use(CssMinimizerPlugin, [
        {
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        },
      ]);
    }

    chain.module.rule('style').test(extToRegexp({ extname: ['css'] }));

    const mode = chain.get('mode');
    const useHot = chain.devServer.get('hot') || false;

    const parent = chain.module.rule('style').rule('css');

    parent
      .oneOf('css-modules-by-query')
      .resourceQuery(/module/)
      .batch(applyOneOf({ mode, esModule }));

    parent
      .oneOf('css-modules-by-filename')
      .batch(applyOneOf({ mode, esModule, auto: true }));

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

    const extract = !useHot;

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'))
        .when(extract, (exclude) =>
          exclude.add(slashToRegexp('/node_modules/mini-css-extract-plugin/')),
        );
    }

    if (extract) {
      chain.plugin('extract-css').use(MiniCssExtractPlugin, [
        {
          filename: '[name].css',
          // chunkFilename: '[id].css',
          ignoreOrder: true,
        },
      ]);
    }

    function takeOptions(loader) {
      if (!esModule) {
        loader.options({ esModule: false });
      }
    }

    chain.module.rule('style').when(
      extract,
      (rule) => {
        rule
          .use('extract-css')
          .loader(MiniCssExtractPlugin.loader)
          .batch(takeOptions);
      },
      (rule) => {
        rule.use('style-loader').loader('style-loader').batch(takeOptions);
      },
    );
  };
};
