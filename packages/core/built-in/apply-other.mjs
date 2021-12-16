import { schema as copySchema } from 'copy-webpack/lib/schema.cjs';

import { notEmpty } from '../lib/utils.mjs';

function objectSize(object) {
  return Object.keys(object || {}).length > 1;
}

export function apply({
  serve,
  config: {
    copy,
    node,
    provide,
    externals,
    devServer,
    experiments: { lazyCompilation } = {},
  },
}) {
  return async (chain) => {
    if (node === false || notEmpty(node)) {
      chain.node.merge(node);
    }

    if (copy.length > 0 ? copy.length > 0 : copy) {
      const { CopyWebpack } = await import('copy-webpack');
      chain.plugin('copy').use(CopyWebpack, [copy]);
    }

    if (externals) {
      chain.externals(externals);
    }

    if (notEmpty(provide)) {
      const {
        default: { ProvidePlugin },
      } = await import('webpack');
      chain.plugin('provide').use(ProvidePlugin, [provide]);
    }

    if (serve && devServer) {
      chain.merge({
        devServer: {
          client: { logging: 'warn' },
          hot: devServer.hot ?? 'only',
          ...devServer,
        },
      });

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
    }
  };
}

export const name = 'other';

export const schema = {
  copy: {
    title: 'Paths to place static file without compile',
    default: false,
    oneOf: [...copySchema.oneOf, { const: false }],
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