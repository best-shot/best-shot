exports.name = 'preset-serve';

function isRelative(publicPath) {
  return ['', './'].includes(publicPath);
}

exports.apply = function applyServe({ config: { devServer = {} } }) {
  return (chain) => {
    // @ts-ignore
    const { historyApiFallback } = devServer;

    const globalPublicPath = chain.output.get('publicPath');

    const {
      // @ts-ignore
      publicPath = isRelative(globalPublicPath) ? '/' : globalPublicPath,
    } = devServer;

    chain.devServer
      .stats(chain.get('stats'))
      .merge(devServer)
      // @ts-ignore
      .when(devServer.hot === false, (config) => config.hotOnly(false))
      .publicPath(publicPath)
      .historyApiFallback(
        // publicPath !== '/' 的需要特别处理
        publicPath !== '/' && historyApiFallback === true
          ? {
              rewrites: [
                {
                  from: new RegExp(publicPath),
                  to({ parsedUrl: { pathname, path } }) {
                    return pathname.includes('.')
                      ? path
                      : `${publicPath}index.html`;
                  },
                },
              ],
            }
          : historyApiFallback,
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
      },
      useLocalIp: {
        default: true,
      },
      hot: {
        default: true,
      },
      hotOnly: {
        default: true,
      },
      overlay: {
        default: true,
      },
      port: {
        default: 1234,
      },
      contentBase: {
        default: false,
      },
    },
  },
};
