export default {
  presets: ['asset', 'web', 'serve'],
  terser: {
    compress: {
      drop_console: false,
    },
  },
  publicPath: '/',
  chain(config) {
    config.devtool(false);
  },
};
