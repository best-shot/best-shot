// eslint-disable-next-line import/no-extraneous-dependencies
const { srcAlias } = require('best-shot-addons');
// eslint-disable-next-line import/no-extraneous-dependencies

module.exports = {
  presets: ['babel', 'style', 'vue', 'web'],
  html: {
    template: './src/index.tpl',
    templateParameters: {
      title: 'App Title'
    }
  },
  devServer: {
    port: 80,
    proxy: {
      '/proxy/': {
        changeOrigin: true,
        target: 'http://192.168.1.238:8048/',
        pathRewrite: {
          '^/proxy/': '/'
        }
      }
    }
  },
  webpackChain: chain => chain.batch(srcAlias())
};
