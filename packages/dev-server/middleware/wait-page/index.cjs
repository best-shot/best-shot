const webpackDevServerWaitpage = require('webpack-dev-server-waitpage');

const { isRaw } = require('../../lib/utils.cjs');

module.exports = {
  apply(compiler) {
    // @ts-ignore
    webpackDevServerWaitpage.plugin().apply(compiler);
  },
  middleware(server) {
    return webpackDevServerWaitpage(server, {
      title: 'Bundling...',
      // @ts-ignore
      ignore: (req) => isRaw(req.url),
    });
  },
};
