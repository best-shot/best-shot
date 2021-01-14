const { relative } = require('@best-shot/core/lib/path');

const applyFont = require('./lib/apply-font.cjs');
const applyImage = require('./lib/apply-image.cjs');
const applyData = require('./lib/apply-data.cjs');

exports.apply = function applyAsset() {
  return (chain) => {
    const context = chain.get('context');

    chain.batch(applyImage).batch(applyFont).batch(applyData);

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));
  };
};
