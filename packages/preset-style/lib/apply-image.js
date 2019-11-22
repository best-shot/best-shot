'use strict';

const extToRegexp = require('ext-to-regexp');
const { default: ImageminPlugin } = require('imagemin-webpack-plugin');

const imageRegexp = extToRegexp({
  extname: ['jpg', 'jpeg', 'png', 'gif', 'svg']
});

module.exports = function applyImage(chain) {
  const minimize = chain.optimization.get('minimize');

  chain.module
    .rule('image')
    .test(imageRegexp)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: '[name].[contenthash:8].[ext]',
      outputPath: 'image',
      esModules: true
    });

  if (minimize) {
    chain.optimization.minimizer('imagemin').use(ImageminPlugin, [
      {
        test: imageRegexp,
        jpegtran: { progressive: true },
        svgo: {
          plugins: [
            { removeAttrs: { attrs: 'data-*' } },
            { removeAttrs: { attrs: 'data.*' } },
            { removeDimensions: true },
            { removeScriptElement: true },
            { removeTitle: true },
            { removeUselessStrokeAndFill: true },
            { removeViewBox: true }
          ]
        }
      }
    ]);
  }
};
