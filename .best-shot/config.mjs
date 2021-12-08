export default {
  presets: ['asset', 'web', 'style'],
  terser: {
    compress: {
      drop_console: false,
    },
  },
  devServer: {},
  output: {
    publicPath: '/',
  },
  chain(config) {
    config.devtool(false);
  },
};
