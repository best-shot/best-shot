'use strict';

const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const { relative } = require('@best-shot/core/lib/path');

exports.name = 'preset-vue';

exports.apply = function applyVue() {
  return chain => {
    const mode = chain.get('mode');
    const context = chain.get('context');

    const useStyle = chain.module.rule('style').uses.has('style-loader');

    if (useStyle) {
      chain.module
        .rule('style')
        .use('style-loader')
        .loader('vue-style-loader')
        .options({
          sourceMap: mode === 'development'
        });
    }

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
