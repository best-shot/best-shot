const deepMerge = require('deepmerge');
const browserslist = require('browserslist');

const displayName = 'tersor';

exports.name = displayName;

function haveSafari10(path) {
  const config = browserslist.loadConfig({ path });

  const list = config && config.length > 0 ? config : browserslist.defaults;

  return browserslist([
    ...list,
    'not ios_saf > 11',
    'not safari > 11',
    'not ios_saf < 10',
    'not safari < 10',
  ]).some((item) => item.includes('saf'));
}

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

exports.apply = function applyTersor({ config: { terser = {} } }) {
  return (chain) => {
    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      const context = chain.get('context');

      const TerserPlugin = require('terser-webpack-plugin');
      chain.optimization.minimizer('terser').use(TerserPlugin, [
        {
          extractComments: false,
          terserOptions: deepMerge(
            {
              safari10: haveSafari10(context),
              compress: {
                drop_console: true,
              },
              output: {
                comments: false,
                ascii_only: true,
              },
            },
            terser,
            { arrayMerge: overwriteMerge },
          ),
        },
      ]);
    }
  };
};

exports.schema = {
  terser: {
    title: 'terserOptions',
    type: 'object',
  },
};
