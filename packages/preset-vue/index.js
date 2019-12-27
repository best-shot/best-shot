const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const { relative } = require('@best-shot/core/lib/path');

exports.name = 'preset-vue';

exports.apply = function applyVue() {
  return chain => {
    const context = chain.get('context');

    chain.module
      .rule('vue')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          whitespace: 'condense'
        },
        hotReload: chain.devServer.get('hot') || false
      });

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));

    chain.plugin('vue-loader').use(VueLoaderPlugin);
  };
};
