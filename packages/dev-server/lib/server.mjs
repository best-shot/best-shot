import launchMiddleware from 'launch-editor-middleware';
import WebpackDevServer from 'webpack-dev-server';

import { notFound } from '../middleware/not-found/index.mjs';
import { staticFile } from '../middleware/static-file/index.mjs';
import * as waitPage from '../middleware/wait-page/index.mjs';

export function DevServer(compiler, { setupMiddlewares, ...options }) {
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

  const Server = new WebpackDevServer(
    {
      ...options,
      setupMiddlewares(middlewares, devServer) {
        if (process.env.TERM_PROGRAM === 'vscode') {
          devServer.app.use('/__open-in-editor', launchMiddleware('code'));
        }

        devServer.app.use(staticFile());

        middlewares.unshift({
          name: 'webpack-wait-page',
          middleware: waitPage.middleware(devServer),
        });

        if (publicPath.startsWith('/')) {
          const index = middlewares.findIndex(
            ({ name }) => name === 'connect-history-api-fallback',
          );

          if (index > -1) {
            // eslint-disable-next-line no-param-reassign
            middlewares[index].path = publicPath;
          }
        }

        middlewares.push({
          name: 'page-not-found',
          middleware: notFound({
            publicPath: publicPath.startsWith('/') ? publicPath : '/',
          }),
        });

        if (typeof setupMiddlewares === 'function') {
          return setupMiddlewares(middlewares, devServer);
        }

        return middlewares;
      },
    },
    compiler,
  );

  Server.start();

  return Server;
}
