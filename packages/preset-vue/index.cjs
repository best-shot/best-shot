'use strict';

const extToRegexp = require('ext-to-regexp');

const { relative } = require('path');

const { reaching } = require('settingz');

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

exports.apply = function apply({
  config: {
    vue: { compilerOptions = {}, transformAssetUrls, shadowMode } = {},
  },
}) {
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
        ...(transformAssetUrls && { transformAssetUrls }),
        ...(shadowMode && { shadowMode }),
        compilerOptions: {
          whitespace: 'condense',
          ...compilerOptions,
        },
      });

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));

    const { dependencies = {}, devDependencies = {} } =
      reaching('./package.json');

    const compat =
      dependencies['@vue/compat'] || devDependencies['@vue/compat'];

    if (compat) {
      chain.resolve.alias.set('vue', '@vue/compat');
    }

    const VueLoaderPlugin = IsVue2
      ? require('@best-shot/vue-loader/lib/plugin')
      : require('vue-loader/dist/plugin').default;

    chain.plugin('vue-loader').use(VueLoaderPlugin);
  };
};

exports.schema = {
  asset: {
    type: 'object',
    properties: {
      esModule: {
        default: false,
      },
    },
  },
  vue: {
    type: 'object',
    additionalProperties: false,
    properties: {
      compilerOptions: {
        type: 'object',
      },
      transformAssetUrls: {
        type: 'object',
      },
      shadowMode: {
        type: 'boolean',
      },
    },
  },
};
