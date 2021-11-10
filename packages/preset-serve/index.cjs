'use strict';

exports.name = 'preset-serve';

exports.apply = function applyServe({
  config: {
    devServer,
    lazyCompilation: fallback, // TODO: remove in next major version
    experiments: { lazyCompilation = fallback } = {},
  },
}) {
  return (chain) => {
    if (lazyCompilation !== false) {
      const experiments = chain.get('experiments');

      chain.merge({
        experiments: {
          ...experiments,
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
