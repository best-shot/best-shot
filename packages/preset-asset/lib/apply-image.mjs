import extToRegexp from 'ext-to-regexp';
import svgoConfig from 'svgo-config/lib/config.mjs';

import { nonAscii, removeRoot } from './utils.mjs';

const notDataUrlText = (_, sourcePath) => {
  return sourcePath ? !sourcePath.startsWith('data:') : true;
};

export async function applyImage(chain) {
  const minimize = chain.optimization.get('minimize');

  chain.module
    .rule('image')
    .after('esm')
    .test(
      extToRegexp({
        extname: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
      }),
    )
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

    chain.optimization.minimizer('svgo').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['svg'] }),
        minimizer: {
          implementation: ImageMinimizerPlugin.svgoMinify,
          options: {
            encodeOptions: svgoConfig,
          },
          filter: notDataUrlText,
        },
      },
    ]);

    const { gifMinify, jpgMinify, pngMinify } = await import('./minify.mjs');

    chain.optimization.minimizer('gifsicle').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['gif'] }),
        minimizer: {
          implementation: gifMinify,
          filter: notDataUrlText,
        },
      },
    ]);

    chain.optimization.minimizer('mozjpeg').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['jpg', 'jpeg'] }),
        minimizer: {
          implementation: jpgMinify,
          filter: notDataUrlText,
        },
      },
    ]);

    chain.optimization.minimizer('oxipng').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['png'] }),
        minimizer: {
          implementation: pngMinify,
          filter: notDataUrlText,
        },
      },
    ]);
  }
}
