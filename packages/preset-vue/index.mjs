import { relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import extToRegexp from 'ext-to-regexp';
import { reaching } from 'settingz';

function isVue2() {
  try {
    if (reaching('vue/package.json').version.startsWith('2')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function apply({
  config: {
    vue: { compilerOptions = {}, transformAssetUrls, shadowMode } = {},
  },
}) {
  return async (chain) => {
    const context = chain.get('context');

    const IsVue2 = isVue2();

    chain.module
      .rule('vue')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader(IsVue2 ? '@best-shot/vue-loader' : 'vue-loader')
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

    const { dependencies = {}, devDependencies = {} } =
      reaching('./package.json');

    const compat =
      dependencies['@vue/compat'] || devDependencies['@vue/compat'];

    if (compat) {
      chain.resolve.alias.set('vue', '@vue/compat');
    }

    /* eslint-disable unicorn/no-await-expression-member */
    const VueLoaderPlugin = IsVue2
      ? (await import('@best-shot/vue-loader/lib/plugin.js')).default
      : (await import('vue-loader/dist/plugin.js')).default.default;

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
};
