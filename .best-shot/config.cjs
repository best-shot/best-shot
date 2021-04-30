module.exports = [
  {
    name: '123',
    presets: ['asset'],
    entry: './src/index.scss',
    lazyCompilation: false,
    watchOptions: {
      poll: 2000,
    },
  },
  {
    name: '456',
    presets: ['style', 'serve'],
    entry: './src/index.scss',
    lazyCompilation: {
      imports: true,
      entries: true,
    },
    watchOptions: {
      poll: 1000,
    },
  },
];
