exports.name = 'preset-serve';

function isRelative(publicPath) {
  return ['', './'].includes(publicPath);
}

exports.apply = function applyServe({
  config: { devServer = {}, lazyCompilation },
}) {
  return (chain) => {
    const globalPublicPath = chain.output.get('publicPath');

    // @ts-ignore
    const {
      // @ts-ignore
      publicPath = isRelative(globalPublicPath) ? '/' : globalPublicPath,
      historyApiFallback,
      hot,
    } = devServer;

    if (hot && lazyCompilation !== undefined) {
      chain.merge({ experiments: { lazyCompilation } });
    }

    chain.devServer
      .stats(chain.get('stats'))
      .merge(devServer)
      .when(hot === false, (config) => config.hotOnly(false))
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
  target: {
    default: 'web',
  },
  lazyCompilation: {
    description:
      'See: https://webpack.js.org/configuration/experiments/#experimentslazycompilation',
  },
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
