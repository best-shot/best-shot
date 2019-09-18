'use strict';

const slashToRegexp = require('slash-to-regexp');

// eslint-disable-next-line import/no-extraneous-dependencies
const { MinChunkSizePlugin } = require('webpack').optimize;

function mapValues(obj, func) {
  const arr = Object.entries(obj);
  return arr.reduce(
    (io, [key, value], index) => ({
      ...io,
      [key]: func(value, key, index, arr.length)
    }),
    {}
  );
}

module.exports = function splitChunks(chain, { vendors = {} }) {
  const settings = mapValues(vendors, (value, key, index, length) => {
    const mod = Array.isArray(value) ? `(${value.join('|')})` : value;
    const regexp = slashToRegexp(`/node_modules/${mod}/`);
    return {
      test: regexp,
      name: key,
      chunks: 'initial',
      priority: (length - index + 1) * 10,
      enforce: true,
      reuseExistingChunk: true
    };
  });

  chain.optimization.runtimeChunk('single').splitChunks({
    maxAsyncRequests: 5,
    cacheGroups: {
      ...settings,
      initial: {
        chunks: 'initial',
        enforce: true,
        name: 'initial',
        priority: 10,
        reuseExistingChunk: true,
        test: slashToRegexp('/node_modules/')
      },
      async: {
        chunks: 'async',
        enforce: true,
        reuseExistingChunk: true
      }
    }
  });

  chain
    .plugin('min-chunk-size')
    .use(MinChunkSizePlugin, [{ minChunkSize: 1024 * 8 }]);
};
