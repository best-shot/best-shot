'use strict';

const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const extToRegexp = require('ext-to-regexp');

function applyOneOf({ cssModules = false, mode }) {
  return rule => {
    rule
      .use('css-loader')
      .loader('css-loader')
      .options({
        sourceMap: mode === 'development',
        importLoaders: 3
      })
      .when(cssModules, io =>
        io.tap(options => ({
          ...options,
          localsConvention: 'camelCaseOnly',
          modules: {
            localIdentName: {
              development: '[path][name]__[local]',
              production: '[local]_[hash:base64:8]'
            }[mode]
          }
        }))
      );
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
                discardComments: { removeAll: true }
              }
            ]
          }
        }
      ]);
  }

  chain.module.rule('style').test(extToRegexp({ extname: ['css'] }));

  const mode = chain.get('mode');

  chain.module
    .rule('style')
    .oneOf('css-modules-by-query')
    .resourceQuery(/module/)
    .batch(applyOneOf({ mode, cssModules: true }));

  chain.module
    .rule('style')
    .oneOf('css-modules-by-filename')
    .test(extToRegexp({ suffix: ['module'], extname: ['\\w+'] }))
    .batch(applyOneOf({ mode, cssModules: true }));

  chain.module
    .rule('style')
    .oneOf('normal-css')
    .batch(applyOneOf({ mode }));

  const useHot = chain.devServer.get('hot');
  if (!useHot) {
    chain.plugin('extract-css').use(ExtractCssChunksPlugin, [
      {
        filename: '[name].css',
        // chunkFilename: '[id].css',
        ignoreOrder: false
      }
    ]);
  }

  chain.module.rule('style').when(
    useHot,
    rule => {
      rule.use('style-loader').loader('style-loader');
    },
    rule => {
      rule
        .use('extract-css')
        .loader(ExtractCssChunksPlugin.loader)
        .options({
          hot: chain.devServer.get('hot') || false
          // reloadAll: false
        });
    }
  );
};
