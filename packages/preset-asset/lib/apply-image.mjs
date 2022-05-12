import extToRegexp from 'ext-to-regexp';

import { nonAscii, removeRoot } from './utils.mjs';

const notDataUrlText = (_, sourcePath) => {
  return sourcePath ? !sourcePath.startsWith('data:') : true;
};

function squooshWrapper(implementation) {
  return (...args) => {
    const io = implementation(...args);
    delete globalThis.navigator;

    return io;
  };
}

export async function applyImage(chain) {
  const minimize = chain.optimization.get('minimize');

  chain.module
    .rule('image')
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
          outputPath: 'image',
          filename: (args) => {
            // eslint-disable-next-line no-param-reassign
            args.filename = nonAscii(args.filename);

            return minimize
              ? '[name].min.[contenthash:8][ext]'
              : '[name].[contenthash:8][ext]';
          },
        });
    });

  if (minimize) {
    const { default: ImageMinimizerPlugin } = await import(
      'image-minimizer-webpack-plugin'
    );

    const { svgMinify } = await import('./svg-minify.mjs');

    chain.optimization.minimizer('svgo').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['svg'] }),
        minimizer: {
          implementation: svgMinify,
          filter: notDataUrlText,
        },
      },
    ]);

    const { gifMinify } = await import('./gif-minify.mjs');

    chain.optimization.minimizer('gifsicle').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['gif'] }),
        minimizer: {
          implementation: gifMinify,
          filter: notDataUrlText,
        },
      },
    ]);

    chain.optimization.minimizer('squoosh').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['jpg', 'jpeg', 'png'] }),
        minimizer: {
          implementation: squooshWrapper(ImageMinimizerPlugin.squooshMinify),
          filter: notDataUrlText,
        },
      },
    ]);
  }
}
