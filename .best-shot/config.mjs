export default [
  {
    name: 'renderer',
    presets: ['asset', 'web', 'style', 'babel', 'react', 'env'],
    devServer: {},
    target: 'electron-renderer',
  },
  {
    name: 'main',
    presets: ['babel', 'env'],
    target: 'electron-main',
  },
];
