'use strict';

const extToRegexp = require('ext-to-regexp');

function addExtname(rule) {
  const regexp = rule.get('test');

  rule.test(regexp.add('scss', 'sass', 'less'));
}

module.exports = function applyScssLess(chain) {
  const isDevelopment = chain.get('mode') === 'development';

  chain.module.rule('style').batch(addExtname);
  chain.module.rule('postcss').batch(addExtname);

  chain.module
    .rule('sass')
    .test(extToRegexp({ extname: ['scss', 'sass'] }))
    .use('sass-loader')
    .loader('sass-loader')
    .options({ sourceMap: isDevelopment })
    .when(isDevelopment, io =>
      io.tap(options => ({
        ...options,
        sassOptions: {
          outputStyle: 'expanded'
        }
      }))
    );

  chain.module
    .rule('less')
    .test(extToRegexp({ extname: ['less'] }))
    .use('less-loader')
    .loader('less-loader')
    .options({
      sourceMap: isDevelopment,
      javascriptEnabled: true
    });
};
