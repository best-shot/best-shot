const TerserPlugin = require('terser-webpack-plugin');
const deepMerge = require('deepmerge');
const browserslist = require('browserslist');

const displayName = 'tersor';

exports.name = displayName;

function haveSafari10() {
  const config = browserslist.loadConfig({
    path: process.cwd(),
  });

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
      chain.optimization.minimizer('terser').use(TerserPlugin, [
        {
          cache: false,
          extractComments: false,
          terserOptions: deepMerge(
            {
              safari10: haveSafari10(),
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
