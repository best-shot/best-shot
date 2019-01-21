const CopyWebpackPlugin = require('copy-webpack-plugin');
const { currentPath } = require('../../lib/common');

const displayName = 'copy-static';

exports.name = displayName;

exports.apply = function applyCopy({
  options: { serve },
  config: { staticPath }
}) {
  return chain =>
    chain.when(staticPath && staticPath.length && !serve, config =>
      config.plugin(displayName).use(CopyWebpackPlugin, [
        staticPath.map(dir => ({
          from: currentPath(dir),
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
    description: '静态文件目录',
    default: ['./static'],
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
