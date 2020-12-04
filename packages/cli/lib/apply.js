module.exports = {
  applyProgress(chain) {
    // eslint-disable-next-line global-require
    const WebpackBar = require('webpackbar');

    chain.plugin('progress-bar').use(WebpackBar, [
      {
        name: 'BEST-SHOT',
        reporter: 'profile',
      },
    ]);
  },
};
