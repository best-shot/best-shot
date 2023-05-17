import extToRegexp from 'ext-to-regexp';

import { nonAscii } from './utils.mjs';

export function applyFont(chain) {
  chain.module
    .rule('font')
    .after('esm')
    .test(
      extToRegexp({
        extname: ['woff', 'woff2', 'otf', 'eot', 'ttf'],
      }),
    )
    .type('asset/resource')
    .set('generator', {
      filename: (args) => {
        // eslint-disable-next-line no-param-reassign
        args.filename = nonAscii(args.filename);

        return 'font/[name].[contenthash:8][ext]';
      },
    });
}
