const CopyWebpackPlugin = require('copy-webpack-plugin');

const displayName = 'copy';

exports.name = displayName;

exports.apply = function applyCopy({
  options: { serve },
  config: { staticPath }
}) {
  return chain =>
    chain.when(staticPath && staticPath.length && !serve, config =>
      config.plugin(displayName).use(CopyWebpackPlugin, [
        staticPath.map(dir => ({
          from: dir,
          to: './'
        })),
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
    default: ['static'],
    oneOf: [
      {
        items: {
          minLength: 1,
          type: 'string'
        },
        type: 'array',
        uniqueItems: true
      },
      {
        const: false
      }
    ]
  }
};
