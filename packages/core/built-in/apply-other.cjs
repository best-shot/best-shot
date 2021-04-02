const { schema } = require('copy-webpack/lib/schema.cjs');

exports.name = 'other';

exports.apply = function applyOther({ config: { copy, node, provide } }) {
  return (chain) => {
    chain.node.merge(node);

    if (copy && copy.length > 0) {
      const { CopyWebpack } = require('copy-webpack');
      chain.plugin('copy').use(CopyWebpack, [copy]);
    }

    if (provide && Object.values(provide).some((item) => item !== undefined)) {
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
  node: {
    type: 'object',
    default: {},
    properties: {
      __dirname: {
        default: true,
      },
      __filename: {
        default: true,
      },
      global: {
        default: false,
      },
    },
  },
  provide: {
    type: 'object',
  },
};
