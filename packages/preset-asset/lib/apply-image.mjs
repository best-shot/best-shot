import extToRegexp from 'ext-to-regexp';

import { nonAscii, removeRoot } from './utils.mjs';

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
    // webpack's built-in XML minimizer handles SVGs with an svgo-compatible
    // option set, so the separate svgo minimizer is no longer needed.
    chain.optimization.set('minimizeOptions', {
      ...chain.optimization.get('minimizeOptions'),
      xml: {
        comments: false,
        removeTitles: true,
        removeMetadata: true,
        removeEditorData: true,
        removeDescriptions: true,
        removeAttributes: ['data-*', 'data.*', 'id'],
        convertShapes: true,
        cleanupIds: true,
        sortAttributes: true,
      },
    });

    const { default: MinimizerPlugin } =
      await import('minimizer-webpack-plugin');

    const { gifMinify } = await import('./minify.mjs');

    chain.optimization.minimizer('image').use(MinimizerPlugin, [
      {
        test: extToRegexp({
          extname: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'],
        }),
        minify: [MinimizerPlugin.napiRsImageMinify, gifMinify],
      },
    ]);
  }
}
