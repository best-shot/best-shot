import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

export function apply({
  config: { vue: { compilerOptions = {}, ...other } = {} },
}) {
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
        },
      });

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );

    /* eslint-disable unicorn/no-await-expression-member */
    const VueLoaderPlugin = (
      await import('@best-shot/vue-loader/dist/plugin.js')
    ).default.default;

    chain.plugin('vue-loader').use(VueLoaderPlugin);

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
};
