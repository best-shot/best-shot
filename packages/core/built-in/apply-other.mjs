import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { schema as copySchema } from 'copy-webpack/lib/schema.cjs';

import { notEmpty } from '../lib/utils.mjs';

function objectSize(object) {
  return Object.keys(object || {}).length > 1;
}

export function apply({
  serve,
  config: {
    copy,
    provide,
    externals,
    devServer,
    experiments: { lazyCompilation } = {},
    cache: { maxAge = 1000 * 60 * 60 * 24 * 3 } = {},
  },
}) {
  return async (chain) => {
    if (copy.length > 0 || copy) {
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
      chain.devServer
        .set('client', { logging: 'warn' })
        .set('hot', 'only')
        .merge(devServer);

      if (lazyCompilation !== false) {
        chain.experiments.lazyCompilation(
          lazyCompilation === true
            ? { entries: objectSize(chain.entryPoints.entries()) > 1 }
            : lazyCompilation,
        );
      }
    }

    const cache = chain.get('cache');
    const mode = chain.get('mode');

    if (cache) {
      const { cachePath } = chain.get('x');
      const watch = chain.get('watch');

      chain.cache({
        type: 'filesystem',
        cacheDirectory: cachePath('webpack'),
        maxAge,
        name: serve && devServer ? 'serve' : watch ? 'watch' : mode,
        buildDependencies: {
          config: [fileURLToPath(join(import.meta.url, '../../../'))],
        },
      });
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
