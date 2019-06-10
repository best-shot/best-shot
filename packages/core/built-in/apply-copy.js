'use strict';

const CopyWebpackPlugin = require('copy-webpack-plugin');

const displayName = 'copy';

exports.name = displayName;

exports.apply = function applyCopy({ config: { staticPath } }) {
  return chain => {
    chain.when(staticPath && staticPath.length, config => {
      config
        .plugin(displayName)
        .use(CopyWebpackPlugin, [
          staticPath.map(dir => ({ from: dir, to: './' })),
          { ignore: ['.gitkeep'] }
        ]);
    });
  };
};

exports.schema = {
  staticPath: {
    title: 'Paths to place static file without compile',
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
