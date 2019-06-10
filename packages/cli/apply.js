'use strict';

const WebpackBar = require('webpackbar');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { join } = require('path');

function applyAnalyzer(chain) {
  const rootPath = process.cwd();
  const reportPath = '.best-shot/stats';
  chain.optimization.concatenateModules(false);
  chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
    {
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false,
      reportFilename: join(rootPath, reportPath, 'index.html'),
      statsFilename: join(rootPath, reportPath, 'data.json')
    }
  ]);
}

function applyProgress(chain) {
  chain.plugin('progress-bar').use(WebpackBar, [
    {
      name: 'BEST-SHOT',
      reporter: 'profile'
    }
  ]);
}

module.exports = {
  applyProgress,
  applyAnalyzer
};
