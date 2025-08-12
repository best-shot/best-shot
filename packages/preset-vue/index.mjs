import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

export function apply({
  config: { vue: { compilerOptions = {}, importMap = false, ...other } = {} },
}) {
  return async (chain) => {
    chain.module
      .rule('vue')
      .after('esm')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader(fileURLToPath(import.meta.resolve('@best-shot/vue-loader')))
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

    if (importMap) {
      const { parse } = await import('./compiler.mjs');

      chain.module
        .rule('vue')
        .after('esm')
        .use('vue-loader')
        .tap((options) => ({ ...options, parse }));
    }

    const { default: VueLoaderPlugin } = await import(
      '@best-shot/vue-loader/dist/pluginWebpack5.js'
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
    default: {},
    properties: {
      compilerOptions: {
        type: 'object',
      },
      importMap: {
        type: 'boolean',
        default: false,
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
  resolve: {
    type: 'object',
    properties: {
      alias: {
        type: 'object',
        properties: {
          'vue-demi$': {
            default: 'vue-demi/lib/v3/index.mjs',
          },
        },
      },
    },
  },
};
