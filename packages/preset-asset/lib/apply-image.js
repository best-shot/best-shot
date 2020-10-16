const extToRegexp = require('ext-to-regexp');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const imageRegexp = extToRegexp({
  extname: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
});

module.exports = function applyImage(chain) {
  const minimize = chain.optimization.get('minimize');

  chain.module
    .rule('image')
    .test(imageRegexp)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: minimize
        ? '[name].min.[contenthash:8].[ext]'
        : '[name].[contenthash:8].[ext]',
      outputPath: 'image',
      esModule: false,
    });

  if (minimize) {
    chain.optimization.minimizer('imagemin').use(ImageMinimizerPlugin, [
      {
        cache: false,
        test: imageRegexp,
        minimizerOptions: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            [
              'svgo',
              {
                multipass: true,
                plugins: Object.entries({
                  inlineStyles: { onlyMatchedOnce: false },
                  moveElemsAttrsToGroup: false,
                  removeAttrs: { attrs: ['data-*', 'data.*'] },
                  removeDimensions: true,
                  removeScriptElement: true,
                  sortAttrs: true,
                  removeAttributesBySelector: {
                    selector: 'svg',
                    attributes: ['id', 'xml:space'],
                  },
                }).map(([key, value]) => ({ [key]: value })),
              },
            ],
          ],
        },
      },
    ]);
  }
};
