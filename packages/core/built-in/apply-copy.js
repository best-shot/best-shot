const CopyWebpack = require('copy-webpack');
const { schema } = require('copy-webpack/lib/schema');

const displayName = 'copy';

exports.name = displayName;

exports.apply = function applyCopy({ config: { static: staticPath } }) {
  return (chain) => {
    chain.when(staticPath && staticPath.length > 0, (config) => {
      config.plugin(displayName).use(CopyWebpack, [staticPath]);
    });
  };
};

exports.schema = {
  static: {
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
