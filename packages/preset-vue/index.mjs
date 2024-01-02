import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import { getPkg, haveLocalDependencies } from 'settingz';

function isVue2() {
  const { vue = '' } = getPkg('dependencies');

  return !vue || /^[\^~]?2\./.test(vue);
}

function batch(theChain) {
  theChain.tap((options) => ({
    ...options,
    esModule: false,
    modules: {
      ...options.modules,
      namedExport: false,
    },
  }));
}

export function apply({
  config: { vue: { compilerOptions = {}, ...other } = {} },
}) {
  return async (chain) => {
    const context = chain.get('context');

    const IsVue2 = isVue2();

    chain.module
      .rule('vue')
      .after('esm')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader(IsVue2 ? 'vue-loader' : '@best-shot/vue-loader')
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

    if (haveLocalDependencies('@vue/compat')) {
      chain.resolve.alias.set('vue', '@vue/compat');
    }

    /* eslint-disable unicorn/no-await-expression-member */
    const VueLoaderPlugin = IsVue2
      ? (await import('vue-loader/lib/plugin.js')).default
      : (await import('@best-shot/vue-loader/dist/plugin.js')).default.default;

    chain.plugin('vue-loader').use(VueLoaderPlugin);

    if (IsVue2) {
      const notURL = chain.module.rule('style').rule('all').oneOf('not-url');

      notURL.oneOf('css-modules-by-filename').use('css-loader').batch(batch);

      notURL.oneOf('css-modules-by-query').use('css-loader').batch(batch);
    }

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
