const { schema } = require('copy-webpack/lib/schema.cjs');

exports.name = 'other';

function notEmpty(object) {
  return object && Object.values(object).some((item) => item !== undefined);
}

exports.apply = function applyOther({
  config: { copy, node, provide, alias },
}) {
  return (chain) => {
    chain.node.merge(node);

    if (copy && copy.length > 0) {
      const { CopyWebpack } = require('copy-webpack');
      chain.plugin('copy').use(CopyWebpack, [copy]);
    }

    if (notEmpty(provide)) {
      const { ProvidePlugin } = require('webpack');
      chain.plugin('provide').use(ProvidePlugin, [provide]);
    }

    if (notEmpty(alias)) {
      chain.resolve.alias.merge(alias);
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
  alias: {
    type: 'object',
  },
};
