const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { resolve } = require('@best-shot/core/lib/path');

function getReportPath(rootPath, filename) {
  return resolve(rootPath, '.best-shot/stats', filename);
}

module.exports = {
  applyProgress(chain) {
    chain.plugin('progress-bar').use(WebpackBar, [
      {
        name: 'BEST-SHOT',
        reporter: 'profile',
      },
    ]);
  },
  applyAnalyzer(chain) {
    const rootPath = chain.get('context');

    chain.optimization.concatenateModules(false);

    chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
      {
        analyzerMode: 'static',
        generateStatsFile: true,
        openAnalyzer: false,
        reportFilename: getReportPath(rootPath, 'index.html'),
        statsFilename: getReportPath(rootPath, 'data.json'),
      },
    ]);
  },
};
