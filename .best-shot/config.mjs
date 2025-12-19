export const config = {
  presets: ['babel', 'style', 'asset', 'mini'],
  mini: {
    type: 'miniprogram',
  },
  entry: {
    'page/abc': './abc.vue',
  },
  context: 'src',
  output: {
    module: true,
  },
  chain(chain) {
    chain.cache(false);

    chain.stats('errors-warnings');
  },
  // devServer: {},
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
