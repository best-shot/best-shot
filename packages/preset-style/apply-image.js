const extToRegexp = require('ext-to-regexp');
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const imageRegexp = extToRegexp('jpg', 'jpeg', 'png', 'gif', 'svg');

module.exports = function applyImage() {
  return chain => {
    const minimize = chain.optimization.get('minimize');
    return chain
      .batch(config =>
        config.module
          .rule('image')
          .test(imageRegexp)
          .use('file-loader')
          .loader('file-loader')
          .options({
            name: 'image/[name].[hash:8].[ext]'
          })
      )
      .when(minimize, config =>
        config.optimization.minimizer('image-min').use(ImageminPlugin, [
          {
            test: imageRegexp,
            jpegtran: { progressive: true },
            svgo: {
              plugins: [
                { removeAttrs: { attrs: 'data-*' } },
                { removeAttrs: { attrs: 'data.*' } },
                { removeAttrs: { value: 'null' } },
                { removeDimensions: true },
                { removeScriptElement: true },
                { removeTitle: true },
                { removeUselessStrokeAndFill: true },
                { removeViewBox: true }
              ]
            }
          }
        ])
      );
  };
};
