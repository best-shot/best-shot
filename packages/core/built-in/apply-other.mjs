import { resolve } from 'node:path';

import { schema as copySchema } from 'copy-webpack/lib/schema.cjs';

import { notEmpty } from '../lib/utils.mjs';

function objectSize(object) {
  return Object.keys(object || {}).length > 1;
}

function fileExists(path) {
  try {
    const filename = resolve(process.cwd(), path);

    import.meta.resolve(filename);

    return [path];
  } catch {
    return [];
  }
}

export function apply({
  serve,
  config: {
    copy,
    provide,
    externals,
    externalsType,
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

    if (externalsType) {
      chain.externalsType(externalsType);
    }

    if (notEmpty(provide)) {
      const {
        default: { ProvidePlugin },
      } = await import('webpack');
      chain.plugin('provide').use(ProvidePlugin, [provide]);
    }

    if (serve && devServer) {
      chain.devServer.client({ logging: 'warn' }).hot('only').merge(devServer);

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
      const name = chain.get('name');

      chain.cache({
        type: 'filesystem',
        cacheDirectory: cachePath('webpack'),
        maxAge,
        name: [name, serve && devServer ? 'serve' : watch ? 'watch' : mode]
          .filter(Boolean)
          .join('-'),
        buildDependencies: {
          config: [
            fileExists('.best-shot/config.mjs'),
            fileExists('.best-shot/env.toml'),
            fileExists('.best-shot/env.yaml'),
          ],
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
