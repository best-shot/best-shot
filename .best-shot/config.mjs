export const config = {
  presets: ['mini', 'babel', 'style', 'asset'],
  appConfig: !true,
  context: 'src',
  output: {
    publicPath: '/',
    module: true,
  },
  chain(chain) {
    chain.entry('pages/home/index').add('./pages/home/index.vue');
  },
};
