import { copyPatterns } from '../lib/copy-patterns.mjs';
import { notEmpty } from '../lib/utils.mjs';

function objectSize(object) {
  return Object.keys(object || {}).length > 1;
}

export function apply({
  cwd,
  serve,
  config: {
    copy,
    provide,
    externals,
    externalsType,
    devServer,
    experiments: { lazyCompilation } = {},
    cache: { maxAge = 1000 * 60 * 60 * 24 * 3, compression } = {},
    stats = {},
  },
}) {
  return async (chain) => {
    if (copy && (!Array.isArray(copy) || copy.length > 0)) {
      chain.output.set('copy', copyPatterns(copy, cwd));
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
    const watch = chain.get('watch');

    if (watch) {
      chain.stats({
        preset: 'errors-warnings',
        ...stats,
      });
    }

    if (cache) {
      const { cachePath } = chain.get('x');

      const name = chain.get('name');

      chain.cache({
        type: 'filesystem',
        cacheDirectory: cachePath('webpack'),
        maxAge,
        // webpack 5.109+ supports zstd, which compresses the filesystem cache
        // faster and denser than gzip on Node.js with native zstd support.
        ...(compression && { compression }),
        name: [name, serve && devServer ? 'serve' : watch ? 'watch' : mode]
          .filter(Boolean)
          .join('-'),
      });
    }
  };
}

export const name = 'other';

export const schema = {
  copy: {
    title: 'Paths to place static file without compile',
    default: false,
    oneOf: [
      { type: 'string', minLength: 1 },
      {
        type: 'object',
        required: ['from'],
        properties: {
          from: { type: 'string', minLength: 1 },
          hashbang: { type: 'boolean' },
        },
      },
      {
        type: 'array',
        items: {
          anyOf: [
            { type: 'string', minLength: 1 },
            {
              type: 'object',
              required: ['from'],
              properties: {
                from: { type: 'string', minLength: 1 },
                hashbang: { type: 'boolean' },
              },
            },
          ],
        },
        uniqueItems: true,
        minItems: 1,
      },
      { const: false },
    ],
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
