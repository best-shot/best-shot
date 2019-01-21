const ExtractCssChunksPlugin = require('extract-css-chunks-webpack-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const Autoprefixer = require('autoprefixer');
const extToRegexp = require('ext-to-regexp');

module.exports = function applyStylesheet({ browsers, mode }) {
  return chain => {
    const useHot = chain.devServer.get('hot');
    const minimize = chain.optimization.get('minimize');
    return chain
      .batch(config => config.resolve.extensions.add('.css'))
      .when(!useHot, conf =>
        conf
          .plugin('extract-css')
          .use(ExtractCssChunksPlugin, [{ filename: '[name].css' }])
      )
      .when(minimize, config =>
        config.optimization
          .minimizer('optimize-css')
          .use(OptimizeCssnanoPlugin, [
            {
              sourceMap: false,
              cssnanoOptions: {
                preset: [
                  'default',
                  {
                    // mergeLonghand: false,
                    discardComments: {
                      removeAll: true
                    }
                  }
                ]
              }
            }
          ])
      )
      .module.rule('style')
      .test(extToRegexp('css'))
      .when(
        useHot,
        rule =>
          rule
            .use('style-loader')
            .loader('style-loader')
            .options({ sourceMap: mode === 'development' }),
        rule => rule.use('extract-css').loader(ExtractCssChunksPlugin.loader)
      )
      .use('css-loader')
      .loader('css-loader')
      .options({
        sourceMap: mode === 'development',
        importLoaders: 3
      })
      .end()
      .use('postcss')
      .loader('postcss-loader')
      .options({
        ident: 'postcss',
        sourceMap: mode === 'development',
        plugins: [Autoprefixer({ browsers })]
      });
  };
};
