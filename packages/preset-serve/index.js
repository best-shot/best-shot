'use strict';

const internalIp = require('internal-ip');
const mapValues = require('lodash/mapValues');

exports.name = 'preset-serve';

exports.apply = function applyServe({
  config: { devServer = {}, publicPath = '' }
}) {
  return chain => {
    chain.devServer
      .publicPath(publicPath[0] === '/' ? publicPath : '/')
      .merge(devServer)
      .stats(devServer.stats || chain.get('stats'))
      .end();

    chain.devServer.when(devServer.overlay && devServer.hot, conf => {
      const entry = mapValues(conf.entryPoints.entries(), data =>
        data.values()
      );

      conf.entryPoints
        .clear()
        .end()
        .merge({
          entry: {
            overlay: 'webpack-serve-overlay',
            ...entry
          }
        });
    });
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
