'use strict';

const slashToRegexp = require('slash-to-regexp');
const { relative } = require('@best-shot/core/lib/path');

const applyFont = require('./lib/apply-font');
const applyImage = require('./lib/apply-image');
const applyPostcss = require('./lib/apply-postcss');
const applyScssLess = require('./lib/apply-scss-less');
const applyStylesheet = require('./lib/apply-stylesheet');

exports.apply = function applyStyle() {
  return chain => {
    const context = chain.get('context');

    chain
      .batch(applyStylesheet)
      .batch(applyPostcss)
      .batch(applyScssLess)
      .batch(applyImage)
      .batch(applyFont);

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'));
    }
  };
};
