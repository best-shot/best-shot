'use strict';

const internalIp = require('internal-ip');
const mapValues = require('lodash/mapValues');

exports.apply = function applyDevServer({
  options: { serve, port },
  config: { devServer = {}, publicPath = '' }
}) {
  return chain => {
    chain.when(serve, config =>
      config.devServer
        .publicPath(publicPath[0] === '/' ? publicPath : '/')
        .merge(devServer)
        .stats(config.get('stats'))
        .historyApiFallback(devServer.historyApiFallback)
        .when(port, conf => conf.port(port))
        .end()
        .when(devServer.overlay && devServer.hot, conf => {
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
        })
    );
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
        default: internalIp.v4.sync(),
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
