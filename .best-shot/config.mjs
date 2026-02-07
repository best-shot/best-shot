export const config = {
  presets: [
    // 'babel',
    // 'style',
    // 'asset',
    // 'web',
    'mini',
  ],
  mini: {
    type: 'miniprogram',
  },
  // entry: {
  //   main: './src/style.css',
  // },
  context: 'src',
  output: {
    module: true,
  },
  chain(chain) {
    chain.cache(false);

    chain.stats('errors-warnings');
  },
  devServer: {},
  vue: {
    importMap: true,
  },
  html: {
    darkMode: false,
  },
  define: {
    TEST: {
      abc: true,
    },
  },
};
