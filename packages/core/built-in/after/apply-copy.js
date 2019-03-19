const CopyWebpackPlugin = require('copy-webpack-plugin');

const displayName = 'copy';

exports.name = displayName;

exports.apply = function applyCopy({
  options: { serve },
  config: { staticPath }
}) {
  return chain =>
    chain.when(staticPath && !serve, config =>
      config.plugin(displayName).use(CopyWebpackPlugin, [
        {
          from: staticPath,
          to: './'
        },
        {
          ignore: ['.gitkeep'],
          copyUnmodified: true
        }
      ])
    );
};

exports.schema = {
  staticPath: {
    title: 'Path to serve static file',
    default: 'static',
    oneOf: [
      {
        minLength: 1,
        type: 'string'
      },
      {
        const: false
      }
    ]
  }
};
