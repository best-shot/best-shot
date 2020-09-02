const { relative } = require('@best-shot/core/lib/path');

const applyFont = require('./lib/apply-font');
const applyImage = require('./lib/apply-image');

exports.apply = function applyAsset() {
  return (chain) => {
    const context = chain.get('context');

    chain.batch(applyImage).batch(applyFont);

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));
  };
};
