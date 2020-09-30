const { CopyWebpack } = require('copy-webpack');
const { schema } = require('copy-webpack/lib/schema');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

exports.name = 'other';

exports.apply = function applyOther({ config: { copy } }) {
  return (chain) => {
    const watch = chain.get('watch');

    if (!watch) {
      chain.plugin('clean').use(CleanWebpackPlugin);
    }

    if (copy && copy.length !== 0) {
      chain.plugin('copy').use(CopyWebpack, [copy]);
    }
  };
};

exports.schema = {
  copy: {
    title: 'Paths to place static file without compile',
    default: false,
    oneOf: [
      ...schema.oneOf,
      {
        const: false,
      },
    ],
  },
};
