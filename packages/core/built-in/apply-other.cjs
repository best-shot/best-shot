'use strict';

const { schema } = require('copy-webpack/lib/schema.cjs');

const { notEmpty } = require('../lib/utils.cjs');

exports.name = 'other';

function objectSize(object) {
  return Object.keys(object || {}).length > 1;
}

exports.apply = function applyOther({
  config: {
    copy,
    node,
    provide,
    externals,
    devServer,
    experiments: { lazyCompilation } = {},
  },
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

    if (devServer) {
      chain.merge({
        devServer: {
          client: { logging: 'warn' },
          ...devServer,
        },
      });
    }

    if (notEmpty(provide)) {
      const { ProvidePlugin } = require('webpack');
      chain.plugin('provide').use(ProvidePlugin, [provide]);
    }

    if (lazyCompilation !== false) {
      const experiments = chain.get('experiments');

      chain.merge({
        experiments: {
          ...experiments,
          lazyCompilation:
            lazyCompilation === true
              ? { entries: objectSize(chain.entryPoints.entries()) > 1 }
              : lazyCompilation,
        },
      });
    }
  };
};

exports.schema = {
  copy: {
    title: 'Paths to place static file without compile',
    default: false,
    oneOf: [...schema.oneOf, { const: false }],
  },
  provide: {
    type: 'object',
  },
  experiments: {
    type: 'object',
    default: {},
    properties: {
      lazyCompilation: {
        default: true,
      },
    },
  },
};
