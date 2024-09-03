export const config = {
  presets: ['mini', 'babel', 'style', 'asset'],
  appConfig: true,
  context: 'src',
  output: {
    module: true,
  },
  // optimization: {
  //   runtimeChunk: false,
  //   splitChunks: false,
  // },
  chain(chain) {
    chain.output.library({ type: 'module' });
  },
};
