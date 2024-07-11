export const config = {
  presets: ['babel', 'style', 'mini'],
  appConfig: false,
  context: 'src',
  chain(chain) {
    chain.entry('app').add('./app.vue');
  },
};
