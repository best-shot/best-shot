const WebpackDevServer = require('webpack-dev-server');
const webpackDevServerWaitpage = require('webpack-dev-server-waitpage');
const getPort = require('get-port');
const log = require('webpack-log');

const { isRaw } = require('./lib/utils');
const notFound = require('./middleware/not-found');

module.exports = function DevServer(compiler, options) {
  // @ts-ignore
  webpackDevServerWaitpage.plugin().apply(compiler);

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
      app.use(
        // @ts-ignore
        webpackDevServerWaitpage(server, {
          title: 'Bundling...',
          // @ts-ignore
          ignore: (req) => isRaw(req.url),
        }),
      );
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
