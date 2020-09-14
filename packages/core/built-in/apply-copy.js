const { CopyWebpack } = require('copy-webpack');
const { schema } = require('copy-webpack/lib/schema');

const displayName = 'copy';

exports.name = displayName;

exports.apply = function applyCopy({ config: { copy } }) {
  return (chain) => {
    chain.when(copy && copy.length !== 0, (config) => {
      config.plugin(displayName).use(CopyWebpack, [copy]);
    });
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
