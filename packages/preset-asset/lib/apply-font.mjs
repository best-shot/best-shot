import extToRegexp from 'ext-to-regexp';

export function applyFont(chain) {
  chain.module
    .rule('font')
    .after('esm')
    .test(
      extToRegexp({
        extname: ['woff', 'woff2', 'otf', 'eot', 'ttf'],
      }),
    )
    .type('asset/resource');
}
