import slashToRegexp from 'slash-to-regexp';

function mapValues(obj, func) {
  const arr = Object.entries(obj);

  return Object.fromEntries(
    arr.map(([key, value], index) => [
      key,
      func(value, key, index, arr.length),
    ]),
  );
}

const force = {
  enforce: true,
  reuseExistingChunk: true,
};

export function splitChunks({ vendors = {} }) {
  return async (chain) => {
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

    chain.optimization.splitChunks
      .set('maxAsyncRequests', 5)
      .set('cacheGroups', {
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
      });

    const mode = chain.get('mode');

    if (mode === 'production') {
      const { cachePath } = chain.get('x');

      chain.recordsPath(cachePath('records.json'));
    }
  };
}
