'use strict';

const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

const childNodeModules = currentPath.relative(module.paths[0]);

exports.name = 'preset-vue';

exports.apply = function apply({ mode }) {
  return chain => {
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
      .test(extToRegexp('vue'))
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          whitespace: 'condense'
        }
      });

    chain.resolveLoader.modules.add(childNodeModules);
    chain.plugin('vue').use(VueLoaderPlugin);
  };
};
