import webpackbar from 'webpackbar';

export function applyProgress(chain) {
  const name = chain.get('name') || '';

  chain.plugin('progress-bar').use(webpackbar, [
    {
      name: name ? name.toUpperCase() : 'BEST-SHOT',
      reporter: 'profile',
    },
  ]);
}
