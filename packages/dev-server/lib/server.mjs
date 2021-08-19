import { createRequire } from 'module';

import launchMiddleware from 'launch-editor-middleware';
import WebpackDevServer from 'webpack-dev-server';

import { notFound } from '../middleware/not-found/index.mjs';
import * as waitPage from '../middleware/wait-page/index.mjs';

function handleAuto(publicPath) {
  return publicPath === 'auto' ? '/' : publicPath;
}

class BestShotDevServer extends WebpackDevServer {
  // https://github.com/webpack/webpack-dev-server/blob/fd2a4e3ea78d877e9a4a7cdf343ef71e55f0cc57/lib/Server.js#L846
  setupHistoryApiFallbackFeature() {
    const requireLazy = createRequire(import.meta.url);
    const historyApiFallback = requireLazy('connect-history-api-fallback');

    const options =
      typeof this.options.historyApiFallback !== 'boolean'
        ? this.options.historyApiFallback
        : {};

    let logger;

    if (typeof options.verbose === 'undefined') {
      logger = this.logger.log.bind(
        this.logger,
        '[connect-history-api-fallback]',
      );
    }

    const {
      devMiddleware: {
        publicPath = this.compiler.options.output.publicPath,
      } = {},
    } = this.options;

    if (publicPath.startsWith('/')) {
      this.app.use(publicPath, historyApiFallback({ logger, ...options }));
    } else {
      this.app.use(historyApiFallback({ logger, ...options }));
    }
  }
}

export function DevServer(
  compiler,
  { onAfterSetupMiddleware, onBeforeSetupMiddleware, ...options },
) {
  waitPage.apply(compiler);

  process.env.WEBPACK_DEV_SERVER_BASE_PORT = 1234;

  const publicPath = handleAuto(
    options.publicPath || compiler.options.output.publicPath,
  );

  const Server = new BestShotDevServer(
    {
      ...options,
      onBeforeSetupMiddleware(server) {
        if (process.env.TERM_PROGRAM === 'vscode') {
          server.app.use('/__open-in-editor', launchMiddleware('code'));
        }
        if (typeof onBeforeSetupMiddleware === 'function') {
          onBeforeSetupMiddleware(server);
        }
        server.app.use(waitPage.middleware(server));
      },
      onAfterSetupMiddleware(server) {
        if (typeof onAfterSetupMiddleware === 'function') {
          onAfterSetupMiddleware(server);
        }
        server.app.use(
          notFound({
            publicPath: publicPath.startsWith('/') ? publicPath : '/',
          }),
        );
      },
    },
    compiler,
  );

  Server.start();

  return Server;
}
