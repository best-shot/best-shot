import { createRequire } from 'node:module';
import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

export function apply({
  config: { vue: { compilerOptions = {}, ...other } = {} },
}) {
  const Require = createRequire(import.meta.url);

  return async (chain) => {
    const context = chain.get('context');

    chain.module
      .rule('vue')
      .after('esm')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader('@best-shot/vue-loader')
      .options({
        ...other,
        hotReload: Boolean(chain.devServer.get('hot')) || false,
        compilerOptions: {
          whitespace: 'condense',
          ...compilerOptions,
          isCustomElement: Array.isArray(compilerOptions.isCustomElement)
            ? (tag) => compilerOptions.isCustomElement.includes(tag)
            : compilerOptions.isCustomElement,
        },
      });

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );

    const VueLoaderPlugin = Require(
      '@best-shot/vue-loader/dist/pluginWebpack5.js',
    );

    chain.plugin('vue-loader').use(VueLoaderPlugin.default);

    chain.plugin('define').tap(([defines]) => [
      {
        ...defines,
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      },
    ]);
  };
}

export const name = 'preset-vue';

export const schema = {
  vue: {
    type: 'object',
    properties: {
      compilerOptions: {
        type: 'object',
      },
    },
  },
  vendors: {
    type: 'object',
    properties: {
      vue: {
        default: ['vue', '@vue', 'pinia', 'vue-(.)*'],
      },
    },
  },
};
