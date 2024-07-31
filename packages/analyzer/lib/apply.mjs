import { applyProgress } from '@best-shot/cli/lib/apply-progress.mjs';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

export function applyAnalyzer(chain) {
  const { cachePath } = chain.get('x');

  applyProgress(chain);

  chain.output.path(cachePath('build'));

  chain.optimization.concatenateModules(false);

  chain.delete('recordsPath');

  chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
    {
      analyzerMode: 'static',
      generateStatsFile: true,
      reportFilename: cachePath('stats.html'),
      statsFilename: cachePath('stats.json'),
    },
  ]);
}
