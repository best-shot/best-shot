'use strict';

const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');
const autoprefixer = require('autoprefixer');

module.exports = function applyStylesheet(chain) {
  const mode = chain.get('mode');

  const useHot = chain.devServer.get('hot');
  const minimize = chain.optimization.get('minimize');

  chain.resolve.extensions.add('.css');

  if (!useHot) {
    chain
      .plugin('extract-css')
      .use(ExtractCssChunksPlugin, [{ filename: '[name].css' }]);
  }

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
                discardComments: { removeAll: true }
              }
            ]
          }
        }
      ]);
  }

  const Autoprefixer = autoprefixer();

  // @ts-ignore
  Autoprefixer.__expression = "require('autoprefixer')";

  chain.module
    .rule('style')
    .test(extToRegexp('css'))
    .when(
      useHot,
      rule => {
        rule.use('style-loader').loader('style-loader');
      },
      rule => {
        rule.use('extract-css').loader(ExtractCssChunksPlugin.loader);
      }
    )
    .use('css-loader')
    .loader('css-loader')
    .options({
      sourceMap: mode === 'development',
      importLoaders: 3
    })
    .end()
    .use('postcss-loader')
    .loader('postcss-loader')
    .options({
      sourceMap: mode === 'development',
      plugins: [Autoprefixer]
    });

  if (chain.module.rules.has('babel')) {
    chain.module
      .rule('babel')
      .exclude.add(slashToRegexp('/node_modules/css-loader/'));
  }
};
