export function applyProgress(chain) {
  const name = chain.get('name');

  chain.plugin('progress-bar').use('webpackbar', [
    {
      name: name || 'BEST-SHOT',
      reporter: 'profile',
    },
  ]);
}
