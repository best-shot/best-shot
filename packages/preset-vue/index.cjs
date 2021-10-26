'use strict';

const extToRegexp = require('ext-to-regexp');

const { relative } = require('path');

exports.name = 'preset-vue';

function isVue2() {
  try {
    if (require('vue/package.json').version.startsWith('2')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

exports.apply = function apply() {
  return (chain) => {
    const context = chain.get('context');

    const IsVue2 = isVue2();

    chain.module
      .rule('vue')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader(IsVue2 ? '@best-shot/vue-loader' : 'vue-loader')
      .options({
        hotReload: chain.devServer.get('hot') || false,
        compilerOptions: {
          whitespace: 'condense',
        },
      });

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));

    const VueLoaderPlugin = IsVue2
      ? require('@best-shot/vue-loader/lib/plugin')
      : require('vue-loader/dist/plugin').default;

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
