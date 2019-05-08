'use strict';

const extToRegexp = require('ext-to-regexp');

module.exports = function applyFont() {
  return chain => {
    chain.module
      .rule('font')
      .test(extToRegexp('woff', 'woff2', 'otf', 'eot', 'ttf'))
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'font/[name].[hash:8].[ext]'
      });
  };
};
