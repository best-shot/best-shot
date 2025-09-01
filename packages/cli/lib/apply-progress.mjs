import webpackbar from 'webpackbar';
import webpack from 'webpack';

export function applyProgress(chain) {
  const name = chain.get('name') || '';

  if (process.env.CI) {
    chain.plugin('progress-bar').use(webpack.ProgressPlugin, [
      {
        activeModules: true,
      },
    ]);
  } else {
    chain.plugin('progress-bar').use(webpackbar, [
      {
        name: name ? name.toUpperCase() : 'BEST-SHOT',
        reporter: 'profile',
      },
    ]);
  }
}
