const WebpackDevServer = require('webpack-dev-server');
const webpackDevServerWaitpage = require('webpack-dev-server-waitpage');

module.exports = function DevServer(compiler, devServer) {
  const Server = new WebpackDevServer(compiler, {
    ...devServer,
    before(app, server) {
      app.use(
        // @ts-ignore
        webpackDevServerWaitpage(server, {
          title: 'Please wait ...',
        }),
      );

      if (typeof devServer.before === 'function') {
        devServer.before(app, server);
      }
    },
  });

  Server.listen(devServer.port, devServer.host);

  return Server;
};
