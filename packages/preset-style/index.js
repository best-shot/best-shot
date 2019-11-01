'use strict';

const slashToRegexp = require('slash-to-regexp');
const { relative } = require('@best-shot/core/lib/path');

const applyFont = require('./apply-font');
const applyImage = require('./apply-image');
const applyPostcss = require('./apply-postcss');
const applyScssLess = require('./apply-scss-less');
const applyStylesheet = require('./apply-stylesheet');

exports.apply = function apply() {
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
