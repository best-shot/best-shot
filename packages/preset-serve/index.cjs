'use strict';

exports.name = 'preset-serve';

exports.apply = function applyServe({
  config: { devServer, lazyCompilation },
}) {
  return (chain) => {
    if (lazyCompilation !== false) {
      chain.merge({
        experiments: {
          lazyCompilation:
            lazyCompilation === true
              ? {
                  entries:
                    Object.keys(chain.entryPoints.entries() || {}).length > 1,
                }
              : lazyCompilation,
        },
      });
    }

    if (devServer) {
      chain.devServer.merge(devServer);
    }
  };
};

exports.schema = {
  lazyCompilation: {
    default: true,
    title: 'Options for `experiments.lazyCompilation`',
    description:
      'See: https://webpack.js.org/configuration/experiments/#experimentslazycompilation',
    oneOf: [
      {
        type: 'boolean',
      },
      {
        type: 'object',
      },
    ],
  },
  devServer: {
    description: 'Options for `devServer`',
    type: 'object',
    default: {},
    properties: {
      client: {
        type: 'object',
        default: {},
        properties: {
          logging: {
            default: 'warn',
          },
        },
      },
      hot: {
        default: 'only',
      },
      static: {
        default: false,
      },
    },
  },
};
