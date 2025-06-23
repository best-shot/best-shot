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

function pick(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value));
}

const force = {
  enforce: true,
  reuseExistingChunk: true,
};

export function apply({ config: { optimization = {}, vendors = {} } }) {
  return (chain) => {
    if (optimization.runtimeChunk !== undefined) {
      chain.optimization.runtimeChunk(optimization.runtimeChunk);
    }

    if (optimization.splitChunks) {
      const obj = pick({
        ...(vendors.shim === undefined ? undefined : { shim: vendors.shim }),
        ...(vendors.react === undefined ? undefined : { react: vendors.react }),
        ...(vendors.vue === undefined ? undefined : { vue: vendors.vue }),
        ...vendors,
      });

      const settings = mapValues(obj, (value, key, index, length) => {
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

      chain.optimization.splitChunks.maxAsyncRequests(5).cacheGroups({
        ...settings,
        vendor: {
          name: 'vendor',
          test: slashToRegexp('/node_modules/'),
          chunks: 'initial',
          priority: 10,
          ...force,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'initial',
          priority: 5,
          ...force,
        },
        async: {
          chunks: 'async',
          ...force,
        },
      });
    }
  };
}

const regexpFormat = {
  format: 'regex',
  minLength: 1,
  type: 'string',
};

export const schema = {
  vendors: {
    additionalProperties: {
      oneOf: [
        { const: false },
        regexpFormat,
        {
          items: regexpFormat,
          minItems: 1,
          type: 'array',
          uniqueItems: true,
        },
      ],
    },
    type: 'object',
    properties: {
      shim: {
        default: [
          '(.)*-(shim|polyfill)',
          '@babel',
          'core-js-(.)*',
          'core-js',
          'object-assign',
          'regenerator-runtime',
          'whatwg-fetch',
          'tslib',
          'is-buffer',
        ],
      },
    },
    default: {},
    required: ['shim'],
  },
  optimization: {
    type: 'object',
    properties: {
      runtimeChunk: {
        default: false,
      },
      splitChunks: {
        type: 'boolean',
        default: false,
      },
    },
  },
};
