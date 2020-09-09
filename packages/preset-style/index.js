const { relative } = require('@best-shot/core/lib/path');

const applyScssLess = require('./lib/apply-scss-less');
const applyStylesheet = require('./lib/apply-stylesheet');

exports.apply = function applyStyle() {
  return (chain) => {
    const context = chain.get('context');

    chain.batch(applyStylesheet).batch(applyScssLess);

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));
  };
};
