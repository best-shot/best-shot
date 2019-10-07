'use strict';

const slashToRegexp = require('slash-to-regexp');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

const applyFont = require('./apply-font');
const applyImage = require('./apply-image');
const applyPostcss = require('./apply-postcss');
const applyScssLess = require('./apply-scss-less');
const applyStylesheet = require('./apply-stylesheet');

const childNodeModules = currentPath.relative(module.paths[0]);

exports.apply = function apply() {
  return chain => {
    chain
      .batch(applyStylesheet)
      .batch(applyPostcss)
      .batch(applyScssLess)
      .batch(applyImage)
      .batch(applyFont);

    chain.resolveLoader.modules.add(childNodeModules);

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'));
    }
  };
};
