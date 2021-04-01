const extToRegexp = require('ext-to-regexp');
// const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
// const svgoConfig = require('svgo-config/config.json');

const imageRegexp = extToRegexp({
  extname: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
});

// function autoDetect(name, options, packageName = name) {
//   try {
//     if (require(`${packageName}/package.json`).name === packageName) {
//       return [name, options];
//     }
//     return false;
//   } catch {
//     return false;
//   }
// }

module.exports = function applyImage(chain) {
  const minimize = chain.optimization.get('minimize');

  chain.module
    .rule('image')
    .test(imageRegexp)
    .batch((rule) => {
      rule
        .oneOf('mutable')
        .resourceQuery(/mutable/)
        .type('asset/resource')
        .set('generator', {
          filename: (args) => {
            // eslint-disable-next-line no-param-reassign
            args.filename = args.filename.replace(/^src\//, '');
            return '[path][name][ext]';
          },
        });

      rule
        .oneOf('immutable')
        .type('asset/resource')
        .set('generator', {
          filename: minimize
            ? 'image/[name].min.[contenthash:8][ext]'
            : 'image/[name].[contenthash:8][ext]',
        });
    });

  // if (minimize) {
  //   chain.optimization.minimizer('imagemin').use(ImageMinimizerPlugin, [
  //     {
  //       test: imageRegexp,
  //       minimizerOptions: {
  //         plugins: [
  //           autoDetect('gifsicle', { interlaced: true }),
  //           autoDetect('jpegtran', { progressive: true }, 'jpegtran-bin'),
  //           autoDetect('optipng', { optimizationLevel: 5 }, 'optipng-bin'),
  //           ['svgo', svgoConfig],
  //         ].filter(Boolean),
  //       },
  //     },
  //   ]);
  // }
};
