import { relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import extToRegexp from 'ext-to-regexp';
import { getPkg, haveLocalDependencies } from 'settingz';

function isVue2() {
  const { vue = '' } = getPkg('dependencies');

  return !vue || /^[\^~]?2\./.test(vue);
}

export function apply({
  config: {
    vue: { compilerOptions = {}, transformAssetUrls, shadowMode } = {},
  },
}) {
  return async (chain) => {
    const context = chain.get('context');

    chain.module
      .rule('vue')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader('@best-shot/vue-loader')
      .options({
        hotReload: Boolean(chain.devServer.get('hot')) || false,
        ...(transformAssetUrls && { transformAssetUrls }),
        ...(shadowMode && { shadowMode }),
        compilerOptions: {
          whitespace: 'condense',
          ...compilerOptions,
        },
      });

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );

    if (haveLocalDependencies('@vue/compat')) {
      chain.resolve.alias.set('vue', '@vue/compat');
    }

    const IsVue2 = isVue2();

    /* eslint-disable unicorn/no-await-expression-member */
    const VueLoaderPlugin = IsVue2 // eslint-disable-next-line import/no-unresolved
      ? (await import('@best-shot/vue-loader/lib/plugin.js')).default
      : (await import('@best-shot/vue-loader/dist/plugin.js')).default.default;

    chain.plugin('vue-loader').use(VueLoaderPlugin);
  };
}

export const name = 'preset-vue';

export const schema = {
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
  define: {
    default: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },
  },
};
