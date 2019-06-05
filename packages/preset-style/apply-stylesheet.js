'use strict';

const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

module.exports = function applyStylesheet({ mode }) {
  return chain => {
    const useHot = chain.devServer.get('hot');
    const minimize = chain.optimization.get('minimize');

    chain.resolve.extensions.add('.css');

    if (!useHot) {
      chain
        .plugin('extract-css')
        .use(ExtractCssChunksPlugin, [{ filename: '[name].css' }]);
    }

    if (minimize) {
      chain.optimization.minimizer('optimize-css').use(OptimizeCssnanoPlugin, [
        {
          sourceMap: false,
          cssnanoOptions: {
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

    chain.module
      .rule('style')
      .test(extToRegexp('css'))
      .when(
        useHot,
        rule => {
          rule
            .use('style-loader')
            .loader('style-loader')
            .options({ sourceMap: mode === 'development' });
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
        ident: 'postcss',
        sourceMap: mode === 'development'
      });

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'));
    }
  };
};
