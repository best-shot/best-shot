const WebpackDevServer = require('webpack-dev-server');

const getPort = require('get-port');

const log = require('webpack-log');

const launchMiddleware = require('launch-editor-middleware');

const waitPage = require('../middleware/wait-page/index.cjs');
const notFound = require('../middleware/not-found/index.cjs');

module.exports = function DevServer(compiler, options) {
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
      // @ts-ignore
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
};
