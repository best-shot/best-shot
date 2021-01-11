const WebpackDevServer = require('webpack-dev-server');

const getPort = require('get-port');

const log = require('webpack-log');

const launchMiddleware = require('launch-editor-middleware');

const waitPage = require('../middleware/wait-page/index.cjs');
const notFound = require('../middleware/not-found/index.cjs');

module.exports = function DevServer(compiler, options) {
  waitPage.apply(compiler);

  if (
    options.historyApiFallback === true &&
    !compiler.options.output.publicPath.startsWith('/')
  ) {
    const logger = log({ name: 'wds' });
    logger.warn("output.publicPath didn't starts with '/'");
    logger.warn('historyApiFallback might caught assets error');
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

  getPort({ port: options.port })
    .then((port) => {
      Server.listen(port, options.host);
    })
    .catch(() => {
      Server.listen(options.port, options.host);
    });

  return Server;
};
