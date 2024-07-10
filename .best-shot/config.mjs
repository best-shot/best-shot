export const config = {
  presets: ['babel', 'mini'],
  appConfig: false,
  context: 'src',
  chain(chain) {
    chain.entry('app').add('./app.vue');
  },
};
