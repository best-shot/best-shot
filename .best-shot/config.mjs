export default {
  presets: ['style', 'vue', 'web'],
  devServer: {
    hot: false,
  },
  chain(config) {
    config.devtool('source-map');
  },
};
