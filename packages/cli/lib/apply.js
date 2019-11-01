'use strict';

const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { relative } = require('@best-shot/core/lib/path');

const reportPath = '.best-shot/stats';

module.exports = {
  applyProgress(chain) {
    chain.plugin('progress-bar').use(WebpackBar, [
      {
        name: 'BEST-SHOT',
        reporter: 'profile'
      }
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
        reportFilename: relative(rootPath, reportPath, 'index.html'),
        statsFilename: relative(rootPath, reportPath, 'data.json')
      }
    ]);
  }
};
