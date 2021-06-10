const { schema } = require('copy-webpack/lib/schema.cjs');

const { notEmpty } = require('../lib/utils.cjs');

exports.name = 'other';

exports.apply = function applyOther({
  config: { copy, node, provide, externals },
}) {
  return (chain) => {
    if (node) {
      chain.node.merge(node);
    }

    if (copy && copy.length > 0) {
      const { CopyWebpack } = require('copy-webpack');
      chain.plugin('copy').use(CopyWebpack, [copy]);
    }

    if (externals) {
      chain.externals(externals);
    }

    if (notEmpty(provide)) {
      const { ProvidePlugin } = require('webpack');
      chain.plugin('provide').use(ProvidePlugin, [provide]);
    }
  };
};

exports.schema = {
  copy: {
    title: 'Paths to place static file without compile',
    default: false,
    oneOf: [
      ...schema.oneOf,
      {
        const: false,
      },
    ],
  },
  provide: {
    type: 'object',
  },
};
