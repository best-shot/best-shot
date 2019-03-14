// eslint-disable-next-line import/no-extraneous-dependencies
const { srcAlias } = require('best-shot-addons');
// eslint-disable-next-line import/no-extraneous-dependencies

module.exports = {
  presets: ['babel', 'style', 'vue', 'web'],
  html: [
    {
      title: 'App Title 1',
      template: './src/index.tpl'
    },
    {}
  ],
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
