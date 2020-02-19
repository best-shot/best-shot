const isEmpty = require('lodash/isEmpty');
const isObject = require('lodash/isObject');

exports.name = 'preset-serve';

exports.apply = function applyServe({
  // @ts-ignore
  config: { devServer = {} }
}) {
  return chain => {
    const publicPath = chain.output.get('publicPath') || '/';

    chain.devServer
      .merge(devServer)
      .stats(chain.get('stats'))
      .publicPath(publicPath)
      .when(
        publicPath !== '/' &&
          (devServer.historyApiFallback === true ||
            (isObject(devServer.historyApiFallback) &&
              isEmpty(devServer.historyApiFallback))),
        config => {
          // publicPath !== '/' 的需要特别处理
          config.historyApiFallback({
            rewrites: [
              {
                from: new RegExp(publicPath),
                to({ parsedUrl: { pathname, path } }) {
                  return pathname.includes('.')
                    ? path
                    : `${publicPath}index.html`;
                }
              }
            ]
          });
        }
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
        default: 'warn'
      },
      useLocalIp: {
        default: true
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
