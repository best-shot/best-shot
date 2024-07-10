export const config = {
  presets: ['style'],
  context: 'src',
  target: [
    // 'node20',
    'es2024',
  ],
  entry: {
    app: './app.vue',
    'pages/home/index': './pages/home/index.vue',
  },
  output: {
    module: true,
    publicPath: '/',
  },
  terser: {
    compress: {
      drop_console: false,
    },
  },
  dataURI: true,
  chain(chain) {
    chain.module
      .rule('vue')
      .test(/\.vue$/)
      .use('split')
      .loader('@best-shot/sfc-split-loader');
  },
};
