import { createRequire } from 'module';

import launchMiddleware from 'launch-editor-middleware';
import WebpackDevServer from 'webpack-dev-server';

import { notFound } from '../middleware/not-found/index.mjs';
import * as waitPage from '../middleware/wait-page/index.mjs';

class BestShotDevServer extends WebpackDevServer {
  // https://github.com/webpack/webpack-dev-server/blob/79a169baa3eeaf71df068de5d9c6150684dfe35f/lib/Server.js#L1556
  setupHistoryApiFallbackFeature() {
    const { historyApiFallback } = this.options;

    if (
      typeof historyApiFallback.logger === 'undefined' &&
      !historyApiFallback.verbose
    ) {
      historyApiFallback.logger = this.logger.log.bind(
        this.logger,
        '[connect-history-api-fallback]',
      );
    }

    const {
      devMiddleware: {
        publicPath = this.compiler.options.output.publicPath,
      } = {},
    } = this.options;

    const requireLazy = createRequire(import.meta.url);
    const connectHistoryApiFallback = requireLazy(
      'connect-history-api-fallback',
    );

    if (publicPath.startsWith('/')) {
      this.app.use(publicPath, connectHistoryApiFallback(historyApiFallback));
    } else {
      this.app.use(connectHistoryApiFallback(historyApiFallback));
    }
  }
}

export function DevServer(
  compiler,
  { onAfterSetupMiddleware, onBeforeSetupMiddleware, ...options },
) {
  waitPage.apply(compiler);

  process.env.WEBPACK_DEV_SERVER_BASE_PORT = 1234;

  const publicPath = options.publicPath || compiler.options.output.publicPath;

  /* eslint-disable no-param-reassign */
  if (options.hot === undefined) {
    options.hot = 'only';
  }
  if (options.static === undefined) {
    options.static = false;
  }
  /* eslint-enable no-param-reassign */

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
