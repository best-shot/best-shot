export const config = {
  presets: ['mini', 'babel', 'style', 'asset'],
  appConfig: false,
  context: 'src',
  output: {
    publicPath: '/',
    // module: true
  },
  chain(chain) {
    chain.entry('app1').add('./app1.js').add('./app1.json?to-url');

    chain.entry('app2').add('./app2.js');
  },
};
