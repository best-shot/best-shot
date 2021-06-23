import getPort from 'get-port';
import launchMiddleware from 'launch-editor-middleware';
import WebpackDevServer from 'webpack-dev-server';
import log from 'webpack-log';

import { notFound } from '../middleware/not-found/index.mjs';
import * as waitPage from '../middleware/wait-page/index.mjs';

export function DevServer(compiler, options) {
  waitPage.apply(compiler);

  const logger = log({ name: 'wds' });

  if (
    options.historyApiFallback === true &&
    !compiler.options.output.publicPath.startsWith('/')
  ) {
    logger.warn("output.publicPath didn't starts with '/'");
    logger.warn('historyApiFallback might caught assets error');
  }

  const { experiments: { lazyCompilation = false } = {} } = compiler.options;

  if (
    lazyCompilation === true ||
    (lazyCompilation !== false &&
      !(lazyCompilation.imports === false && lazyCompilation.entries === false))
  ) {
    logger.info('lazy compilation is enabled');
  }

  const Server = new WebpackDevServer(compiler, {
    ...options,
    before(app, server) {
      app.use(waitPage.middleware(server));

      if (process.env.TERM_PROGRAM === 'vscode') {
        app.use('/__open-in-editor', launchMiddleware('code'));
      }

      if (typeof options.before === 'function') {
        options.before(app, server);
      }
    },
    after(app, server) {
      if (typeof options.after === 'function') {
        options.after(app, server);
      }
      app.use(notFound({ publicPath: options.publicPath }));
    },
  });

  getPort({ port: [options.port, 1234, 5678] })
    .then((port) => {
      Server.listen(port, options.host);
    })
    .catch(() => {
      Server.listen(options.port, options.host);
    });

  return Server;
}
