export const config = {
  presets: ['babel', 'style', 'asset', 'mini'],
  mini: {
    // type: 'miniprogram',
  },
  // context: 'src',
  output: {
    module: true,
  },
  copy: {
    from: '**',
    to: './miniprogram_npm/tdesign-miniprogram',
    context: '../node_modules/tdesign-miniprogram/miniprogram_dist',
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
