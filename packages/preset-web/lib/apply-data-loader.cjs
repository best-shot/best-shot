const extToRegexp = require('ext-to-regexp');

function dataLoader(chain) {
  chain.module
    .rule('yaml')
    .test(extToRegexp({ extname: ['yml', 'yaml'] }))
    .type('json')
    .use('yaml-loader')
    .loader('yaml-loader');

  chain.module
    .rule('txt')
    .test(extToRegexp({ extname: ['txt'] }))
    .use('raw-loader')
    .loader('raw-loader');
}

module.exports = { dataLoader };
