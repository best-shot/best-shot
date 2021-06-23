'use strict';

const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const { relative } = require('path');

exports.name = 'preset-vue';

exports.apply = function apply() {
  return (chain) => {
    const context = chain.get('context');

    chain.module
      .rule('vue')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        hotReload: chain.devServer.get('hot') || false,
        compilerOptions: {
          whitespace: 'condense',
        },
      });

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));

    chain.plugin('vue-loader').use(VueLoaderPlugin);
  };
};

exports.schema = {
  asset: {
    properties: {
      esModule: {
        default: false,
      },
    },
  },
};
