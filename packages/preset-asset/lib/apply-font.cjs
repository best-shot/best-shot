const extToRegexp = require('ext-to-regexp');

module.exports = function applyFont(chain) {
  chain.module
    .rule('font')
    .test(
      extToRegexp({
        extname: ['woff', 'woff2', 'otf', 'eot', 'ttf'],
      }),
    )
    .type('asset/resource')
    .set('generator', {
      filename: 'font/[name].[contenthash:8][ext]',
    });
};
