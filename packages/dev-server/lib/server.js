const WebpackDevServer = require('webpack-dev-server');
const webpackDevServerWaitpage = require('webpack-dev-server-waitpage');

module.exports = function DevServer(compiler, options) {
  // @ts-ignore
  webpackDevServerWaitpage.plugin().apply(compiler);

  const Server = new WebpackDevServer(compiler, {
    ...options,
    before(app, server) {
      app.use(
        // @ts-ignore
        webpackDevServerWaitpage(server, {
          title: 'Please wait ...',
        }),
      );

      if (typeof options.before === 'function') {
        options.before(app, server);
      }
    },
  });

  Server.listen(options.port, options.host);

  return Server;
};
