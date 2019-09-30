'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

const applyFont = require('./apply-font');
const applyImage = require('./apply-image');
const applyScssLess = require('./apply-scss-less');
const applyStylesheet = require('./apply-stylesheet');

const childNodeModules = currentPath.relative(module.paths[0]);

exports.apply = function apply() {
  return chain => {
    chain
      .batch(applyStylesheet)
      .batch(applyScssLess)
      .batch(applyImage)
      .batch(applyFont);

    chain.resolveLoader.modules.add(childNodeModules);
  };
};
