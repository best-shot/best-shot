'use strict';

const slashToRegexp = require('slash-to-regexp');

function mapValues(obj = {}, func) {
  const arr = Object.entries(obj);
  return arr.reduce(
    (io, [key, value], index) => ({
      ...io,
      [key]: func(value, key, index, arr.length)
    }),
    {}
  );
}

module.exports = function splitChunks(chain, { vendors }) {
  const settings = mapValues(vendors, (value, key, index, length) => {
    const mod = Array.isArray(value) ? `(${value.join('|')})` : value;
    const regexp = slashToRegexp(`/node_modules/${mod}/`);
    return {
      test: regexp,
      name: key,
      chunks: 'all',
      priority: (length - index + 1) * 10,
      enforce: true,
      reuseExistingChunk: true
    };
  });

  return chain.optimization.runtimeChunk('single').splitChunks({
    cacheGroups: {
      ...settings,
      ...(settings.vendor
        ? {}
        : {
          vendor: {
            test: slashToRegexp('/node_modules/'),
            name: 'vendors',
            chunks: 'initial',
            enforce: true,
            priority: 10,
            reuseExistingChunk: true
          }
        }),
      ...(settings.async
        ? {}
        : {
          async: {
            chunks: 'async',
            priority: 0
          }
        })
    }
  });
};
