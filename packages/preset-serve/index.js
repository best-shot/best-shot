const internalIp = require('internal-ip');

exports.name = 'preset-serve';

exports.apply = function applyServe({ config: { devServer = {} } }) {
  return chain => {
    chain.devServer
      .merge(devServer)
      .publicPath(chain.output.get('publicPath') || '/')
      .stats(chain.get('stats'));
  };
};

exports.schema = {
  devServer: {
    description: 'Options of devServer',
    type: 'object',
    default: {},
    properties: {
      clientLogLevel: {
        default: 'warn'
      },
      host: {
        default: internalIp.v4.sync() || 'localhost'
      },
      hot: {
        default: true
      },
      hotOnly: {
        default: true
      },
      overlay: {
        default: true
      },
      port: {
        default: 1234
      },
      contentBase: {
        default: false
      },
      features: {
        default: []
      },
      historyApiFallback: {
        default: true
      }
    }
  }
};
