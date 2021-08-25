'use strict';

const slashToRegexp = require('slash-to-regexp');
const { MinChunkSizePlugin } = require('webpack').optimize;

const { join } = require('path');

function mapValues(obj, func) {
  const arr = Object.entries(obj);
  return Object.fromEntries(arr.map(
    ( [key, value], index) => [key, func(value, key, index, arr.length)],
  ));
}

const force = {
  enforce: true,
  reuseExistingChunk: true,
};

exports.splitChunks = function splitChunks({ vendors = {} }) {
  return (chain) => {
    const settings = mapValues(vendors, (value, key, index, length) => {
      const mod = Array.isArray(value) ? `(${value.join('|')})` : value;
      const regexp = slashToRegexp(`/node_modules/${mod}/`);
      return {
        test: regexp,
        name: key,
        chunks: 'initial',
        priority: (length - index + 1) * 10,
        ...force,
      };
    });

    const initial = {
      chunks: 'initial',
      priority: 10,
      ...force,
    };

    chain.optimization.runtimeChunk('single').splitChunks({
      maxAsyncRequests: 5,
      cacheGroups: {
        ...settings,
        vendor:
          chain.entryPoints.values().length > 1
            ? {
                name: 'common',
                minChunks: 2,
                ...initial,
              }
            : {
                name: 'vendor',
                test: slashToRegexp('/node_modules/'),
                ...initial,
              },
        async: {
          chunks: 'async',
          ...force,
        },
      },
    });

    const mode = chain.get('mode');

    if (mode === 'production') {
      chain
        .plugin('min-chunk-size')
        .use(MinChunkSizePlugin, [{ minChunkSize: 1024 * 8 }]);

      const name = chain.get('name') || '';

      chain.recordsPath(
        join(
          process.cwd(),
          'node_modules/.cache/best-shot/stats',
          name,
          'records.json',
        ),
      );
    }
  };
};
