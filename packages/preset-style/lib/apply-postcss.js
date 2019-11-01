'use strict';

const autoprefixer = require('autoprefixer');

const Autoprefixer = autoprefixer();

// @ts-ignore
Autoprefixer.__expression = "require('autoprefixer')";

module.exports = function applyPostcss(chain) {
  const mode = chain.get('mode');

  const fileRegexp = chain.module.rule('style').get('test');

  chain.module
    .rule('postcss')
    .test(fileRegexp)
    .use('postcss-loader')
    .loader('postcss-loader')
    .options({
      sourceMap: mode === 'development',
      plugins: [Autoprefixer]
    });
};
