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
    const regexp = new RegExp(`[\\\\/]node_modules[\\\\/]${mod}[\\\\/]`);
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
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
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
            name: 'async',
            priority: 0
          }
        })
    }
  });
};
