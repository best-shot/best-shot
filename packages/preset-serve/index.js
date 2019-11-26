'use strict';

const internalIp = require('internal-ip');

exports.name = 'preset-serve';

exports.apply = function applyServe({
  config: { devServer = {}, publicPath = '' }
}) {
  return chain => {
    chain.devServer
      .publicPath(publicPath[0] === '/' ? publicPath : '/')
      .merge(devServer)
      .stats(devServer.stats || chain.get('stats'));

    if (devServer.overlay && devServer.hot) {
      Object.entries(chain.entryPoints.entries()).forEach(([key]) => {
        chain.entry(key).prepend('webpack-serve-overlay');
      });
    }
  };
};

exports.schema = {
  devServer: {
    description: 'Options of devServer',
    type: 'object',
    default: {},
    properties: {
      clientLogLevel: {
        default: 'warn',
        enum: ['trace', 'debug', 'info', 'warn', 'error', 'silent'],
        type: 'string'
      },
      host: {
        default: internalIp.v4.sync() || 'localhost',
        type: 'string'
      },
      hot: {
        default: true,
        type: 'boolean'
      },
      hotOnly: {
        default: true,
        type: 'boolean'
      },
      overlay: {
        default: true,
        type: 'boolean'
      },
      port: {
        default: 1234,
        type: 'number'
      },
      historyApiFallback: {
        default: true,
        oneOf: [
          {
            type: 'boolean'
          },
          {
            type: 'object'
          }
        ]
      }
    }
  }
};
