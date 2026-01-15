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
        extname: ['jpg', 'jpeg', 'png', 'apng', 'gif', 'svg', 'webp'],
      }),
    )
    .batch((rule) => {
      rule
        .oneOf('raw')
        .test(/\.svg$/)
        .dependency({ not: 'url' })
        .with({ type: 'raw' })
        .type('asset/source');

      rule
        .oneOf('mutable')
        .with({ type: 'mutable' })
        .type('asset/resource')
        .generator.filename((args) => {
          // eslint-disable-next-line no-param-reassign
          args.filename = nonAscii(removeRoot(args.filename));

          return '[path][name][ext]';
        });

      rule
        .oneOf('immutable')
        .type('asset/resource')
        .generator.filename((args) => {
          // eslint-disable-next-line no-param-reassign
          args.filename = nonAscii(args.filename);

          return minimize
            ? 'image/[name].min.[contenthash][ext]'
            : 'image/[name].[contenthash][ext]';
        });
    });

  if (minimize) {
    const { default: ImageMinimizerPlugin } =
      await import('image-minimizer-webpack-plugin');

    chain.optimization.minimizer('svg').use(ImageMinimizerPlugin, [
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

    const { baseMinify } = await import('./minify.mjs');

    chain.optimization.minimizer('image').use(ImageMinimizerPlugin, [
      {
        test: extToRegexp({ extname: ['jpg', 'jpeg', 'png', 'gif'] }),
        minimizer: {
          implementation: baseMinify,
        },
      },
    ]);
  }
}
