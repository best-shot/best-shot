export default {
  presets: ['asset', 'web'],
  terser: {
    compress: {
      drop_console: false,
    },
  },
  devServer: {},
  publicPath: '/',
  chain(config) {
    config.devtool(false);
  },
};
