export const config = {
  presets: ['babel', 'style', 'asset', 'mini'],
  appConfig: false,
  context: 'src',
  chain(chain) {
    chain.entry('app').add('./app.js');

    chain.entry('pages/home/index').add('./pages/home/index.vue');
  },
};
