const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const applyProgress = require('@best-shot/cli/lib/apply-progress');

const { resolve: Resolve } = require('path');

const { resolve } = require('@best-shot/core/lib/path');

module.exports = function apply(chain) {
  const rootPath = chain.get('context');
  const name = chain.get('name') || '';

  applyProgress(chain);

  chain.output.path(Resolve(rootPath, `.best-shot/temp/${name}`));

  chain.optimization.runtimeChunk('single').concatenateModules(false);

  function getReportPath(filename) {
    return resolve(rootPath, '.best-shot', 'stats', name, filename);
  }

  chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
    {
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: false,
      reportFilename: getReportPath('report.html'),
      statsFilename: getReportPath('stats.json'),
    },
  ]);
};
