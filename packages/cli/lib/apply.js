const WebpackBar = require('webpackbar');

module.exports = {
  applyProgress(chain) {
    chain.plugin('progress-bar').use(WebpackBar, [
      {
        name: 'BEST-SHOT',
        reporter: 'profile',
      },
    ]);
  },
};
