const TerserPlugin = require('terser-webpack-plugin');
const deepMerge = require('deepmerge');

const displayName = 'tersor';

exports.name = displayName;

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

exports.apply = function applyTersor({ config: { terser = {} } }) {
  return (chain) => {
    const minimize = chain.optimization.get('minimize');

    return chain.when(minimize, (config) => {
      config.optimization.minimizer('terser').use(TerserPlugin, [
        {
          cache: false,
          extractComments: false,
          terserOptions: deepMerge(
            {
              safari10: true, // TODO: auto
              compress: {
                drop_console: true,
              },
              output: {
                beautify: false,
                ascii_only: true,
              },
            },
            terser,
            { arrayMerge: overwriteMerge },
          ),
        },
      ]);
    });
  };
};

exports.schema = {
  terser: {
    title: 'terserOptions',
    type: 'object',
  },
};
