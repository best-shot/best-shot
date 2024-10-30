import express from 'express';
import launchMiddleware from 'launch-editor-middleware';
// eslint-disable-next-line import/namespace
import * as WebpackDevServer from 'webpack-dev-server';

import { notFound } from '../middleware/not-found/index.mjs';
import { staticFile } from '../middleware/static-file/index.mjs';
import * as waitPage from '../middleware/wait-page/index.mjs';

export class DevServer extends WebpackDevServer.default {
  constructor(options, compiler) {
    waitPage.apply(compiler);

    const publicPath = options.publicPath ?? compiler.options.output.publicPath;

    /* eslint-disable no-param-reassign */

    options.proxy &&= (
      Array.isArray(options.proxy) ? options.proxy : [options.proxy]
    ).map((item) => ({
      changeOrigin: true,
      secure: false,
      ...item,
    }));

    options.hot ??= 'only';
    options.static ??= false;
    options.allowedHosts ??= ['all'];

    if (options.port === 443) {
      options.server ??= {};
      options.server.type ??= 'https';
    }

    /* eslint-enable no-param-reassign */

    super(
      {
        ...options,
        setupMiddlewares(middlewares, devServer) {
          if (process.env.TERM_PROGRAM === 'vscode') {
            devServer.app.use('/__open-in-editor', launchMiddleware('code'));
          }

          devServer.app.use(staticFile());

          devServer.app.use(waitPage.middleware(devServer));

          if (publicPath.startsWith('/')) {
            const index = middlewares.findIndex(
              ({ name }) => name === 'connect-history-api-fallback',
            );

            if (index !== -1) {
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

          if (typeof options.setupMiddlewares === 'function') {
            options.setupMiddlewares(middlewares, devServer, express);
          }

          return middlewares;
        },
      },
      compiler,
    );
  }
}
