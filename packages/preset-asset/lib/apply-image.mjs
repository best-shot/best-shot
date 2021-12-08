import extToRegexp from 'ext-to-regexp';
import { reaching } from 'settingz';

import { nonAscii, removeRoot } from './utils.mjs';

const imageRegexp = extToRegexp({
  extname: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
});

export async function applyImage(chain) {
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
            args.filename = nonAscii(removeRoot(args.filename));
            return '[path][name][ext]';
          },
        });

      rule
        .oneOf('immutable')
        .type('asset/resource')
        .set('generator', {
          filename: (args) => {
            // eslint-disable-next-line no-param-reassign
            args.filename = nonAscii(args.filename);
            return minimize
              ? 'image/[name].min.[contenthash:8][ext]'
              : 'image/[name].[contenthash:8][ext]';
          },
        });
    });

  if (minimize) {
    const { default: ImageMinimizerPlugin } = await import(
      'image-minimizer-webpack-plugin'
    );
    const svgoConfig = reaching('svgo-config/config.json');

    chain.optimization.minimizer('imagemin').use(ImageMinimizerPlugin, [
      {
        test: imageRegexp,
        minimizer: {
          options: {
            plugins: [
              ['gifsicle', { interlaced: true }],
              ['jpegtran', { progressive: true }],
              ['optipng', { optimizationLevel: 5 }],
              ['svgo', svgoConfig],
            ],
          },
        },
      },
    ]);
  }
}
