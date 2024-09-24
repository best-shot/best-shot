export const config = {
  presets: ['mini', 'babel', 'style', 'asset'],
  mini: {
    type: 'app',
  },
  context: 'src',
  output: {
    module: true,
  },
  // optimization: {
  //   runtimeChunk: false,
  //   splitChunks: false,
  // },
  chain(chain) {
    // chain.stats({
    //   errorDetails: true,
    // });
    chain.cache(false);
  },
  // devServer: {},
  vue: {
    importMap: true,
  },
  html: {
    darkMode: false,
  },
};
