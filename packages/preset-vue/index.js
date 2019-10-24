'use strict';

const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { currentPath } = require('@best-shot/core/lib/common');

exports.name = 'preset-vue';

exports.apply = function applyVue() {
  return chain => {
    const mode = chain.get('mode');

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

    const childNodeModules = currentPath.relative(module.paths[0]);

    chain.resolveLoader.modules.add(childNodeModules);

    chain.plugin('vue-loader').use(VueLoaderPlugin);
  };
};
