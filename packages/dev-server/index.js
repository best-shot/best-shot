const WebpackDevServer = require('webpack-dev-server');
const webpackDevServerWaitpage = require('webpack-dev-server-waitpage');
const getPort = require('get-port');

const notFound = require('./lib/404');

module.exports = function DevServer(compiler, options) {
  // @ts-ignore
  webpackDevServerWaitpage.plugin().apply(compiler);

  const Server = new WebpackDevServer(compiler, {
    ...options,
    before(app, server) {
      app.use(
        // @ts-ignore
        webpackDevServerWaitpage(server, {
          title: 'Bundling...',
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
