'use strict';

const extToRegexp = require('ext-to-regexp');

// eslint-disable-next-line import/no-extraneous-dependencies
const { objectFilter } = require('@best-shot/core/lib/common');

module.exports = function applyScssLess({ mode }) {
  return chain => {
    const fileRegexp = chain.module.rule('style').get('test');

    chain.module.rule('style').test(fileRegexp.add('scss', 'sass', 'less'));

    chain.module
      .rule('sass')
      .test(extToRegexp('scss', 'sass'))
      .use('sass-loader')
      .loader('sass-loader')
      .options(
        objectFilter({
          sourceMap: mode === 'development',
          outputStyle: mode === 'development' ? 'expanded' : undefined
        })
      );

    chain.module
      .rule('less')
      .test(extToRegexp('less'))
      .use('less-loader')
      .loader('less-loader')
      .options({
        sourceMap: mode === 'development',
        javascriptEnabled: true
      });
  };
};
