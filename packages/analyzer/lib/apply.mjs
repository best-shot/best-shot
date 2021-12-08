import { resolve } from 'path';

import { applyProgress } from '@best-shot/cli/lib/apply-progress.mjs';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const cwd = process.cwd();

function cachePath(type, name) {
  return resolve(cwd, 'node_modules/.cache/best-shot', type, name);
}

export function applyAnalyzer(chain) {
  const name = chain.get('name') || '';

  applyProgress(chain);

  chain.output.path(cachePath('build', name));

  chain.optimization.runtimeChunk('single').concatenateModules(false);

  chain.delete('recordsPath');

  chain.plugin('bundle-analyzer').use(BundleAnalyzerPlugin, [
    {
      analyzerMode: 'static',
      generateStatsFile: true,
      reportFilename: cachePath('stats', `${name}.html`),
      statsFilename: cachePath('stats', `${name}.json`),
    },
  ]);
}
