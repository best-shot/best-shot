'use strict';

const extToRegexp = require('ext-to-regexp');

module.exports = function applyScssLess(chain) {
  const isDevelopment = chain.get('mode') === 'development';

  const fileRegexp = chain.module.rule('style').get('test');

  chain.module.rule('style').test(fileRegexp.add('scss', 'sass', 'less'));

  chain.module
    .rule('sass')
    .test(extToRegexp('scss', 'sass'))
    .use('sass-loader')
    .loader('sass-loader')
    .options({
      sourceMap: isDevelopment,
      ...(isDevelopment
        ? {
            sassOptions: { outputStyle: 'expanded' }
          }
        : undefined)
    });

  chain.module
    .rule('less')
    .test(extToRegexp('less'))
    .use('less-loader')
    .loader('less-loader')
    .options({
      sourceMap: isDevelopment,
      javascriptEnabled: true
    });
};
