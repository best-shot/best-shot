'use strict';

const slashToRegexp = require('slash-to-regexp');

module.exports = function imageAvatar({
  include = slashToRegexp('/src/avatar/')
} = {}) {
  return chain => {
    if (include) {
      chain.module
        .rule('image')
        .use('file-loader')
        .tap(options => ({
          ...options,
          name: file =>
            (include.test(file)
              ? 'avatar/[name].[ext]'
              : '[name].[contenthash:8].[ext]')
        }));
    }
  };
};
