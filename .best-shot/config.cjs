module.exports = {
  presets: ['web', 'asset'],
  terser: {
    compress: {
      drop_console: false,
    },
  },
};
