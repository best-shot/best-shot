const WebpackDevServer = require('webpack-dev-server');

module.exports = function DevServer(compiler, devServer) {
  const server = new WebpackDevServer(compiler, devServer);

  server.listen(devServer.port, devServer.host);
};
