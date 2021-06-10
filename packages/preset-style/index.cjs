const { relative } = require('path');

const applyScssLess = require('./lib/apply-scss-less.cjs');
const applyStylesheet = require('./lib/apply-stylesheet.cjs');

exports.apply = function applyStyle({
  config: { less, asset: { esModule = true } = {} },
}) {
  return (chain) => {
    const context = chain.get('context');

    chain.batch(applyStylesheet(esModule)).batch(applyScssLess(less));

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));
  };
};

exports.schema = {
  less: {
    type: 'object',
  },
  asset: {
    type: 'object',
    default: {},
    properties: {
      esModule: {
        type: 'boolean',
        default: true,
      },
    },
  },
};
