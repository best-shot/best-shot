exports.name = 'preset-serve';

function defined(obj) {
  return obj === true || Object.values(obj).some((item) => item !== undefined);
}

exports.apply = function applyServe({
  // @ts-ignore
  config: { devServer = {} },
}) {
  return (chain) => {
    const publicPath =
      // @ts-ignore
      devServer.publicPath || chain.output.get('publicPath') || '/';

    chain.devServer
      .stats(chain.get('stats'))
      .when(
        // @ts-ignore
        publicPath !== '/' && defined(devServer.historyApiFallback),
        (config) => {
          // publicPath !== '/' 的需要特别处理
          config.historyApiFallback({
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
          });
        },
      )
      .merge(devServer)
      .publicPath(publicPath);
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
      historyApiFallback: {
        default: true,
      },
    },
  },
};
