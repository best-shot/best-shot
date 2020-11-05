const extToRegexp = require('ext-to-regexp');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const imageRegexp = extToRegexp({
  extname: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
});

function autoDetect(name, options) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    if (require(`${name}/package.json`).name === name) {
      return [name, options];
    }
    return false;
  } catch {
    return false;
  }
}

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
            autoDetect('gifsicle', { interlaced: true }),
            autoDetect('jpegtran', { progressive: true }),
            autoDetect('optipng', { optimizationLevel: 5 }),
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
          ].filter(Boolean),
        },
      },
    ]);
  }
};
