export const config = {
  presets: ['mini', 'babel', 'style', 'asset'],
  mini: {
    type: 'miniprogram',
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
  resolve: {
    alias: {
      vue: '@best-shot/sfc-split-plugin/hack/mini.js',
    },
  },
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
