import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

export function apply({ config }) {
  return async (chain) => {
    const {
      compilerOptions = {},
      importMap = false,
      ...other
    } = config.vue || {};
    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .use('babel-loader')
        .tap((options) => ({
          ...options,
          overrides: [
            ...(options.overrides || []),
            {
              test: '**/*.vue',
              presets: [['@babel/typescript', { ignoreExtensions: true }]],
            },
          ],
        }));
    }

    chain.resolveLoader.alias.set(
      '@best-shot/vue-loader$',
      fileURLToPath(import.meta.resolve('@best-shot/vue-loader')),
    );

    chain.module
      .rule('vue')
      .after('esm')
      .test(extToRegexp({ extname: ['vue'] }))
      .use('vue-loader')
      .loader('@best-shot/vue-loader')
      .options({
        ...other,
        experimentalInlineMatchResource: true,
        hotReload: Boolean(chain.devServer.get('hot')),
        compilerOptions: {
          whitespace: 'condense',
          ...compilerOptions,
          isCustomElement: Array.isArray(compilerOptions.isCustomElement)
            ? (tag) => compilerOptions.isCustomElement.includes(tag)
            : compilerOptions.isCustomElement,
        },
      });

    if (importMap) {
      // Only treat the SFC's custom-block sub-request as raw config. Matching
      // every `?blockType=config` request would also turn the component itself
      // (`Foo.vue?blockType=config`) into a source string instead of a module.
      chain.module
        .rule('vue-config-block')
        .after('yaml')
        .resourceQuery(/type=custom.*blockType=config/)
        .type('asset/source');
    }

    // webpack's `css/auto` only detects CSS modules via `.module.` in the file
    // name. Vue's `<style module>` uses a `module=true` query on a virtual
    // request, so force `css/module` for those blocks. The regex matches both
    // the original `.vue.css` path and the cloned `.vue.css.css` resource that
    // VueLoaderPlugin produces via inline matchResource.
    chain.module
      .rule('vue-style-module')
      .test(/\.vue\.(?:css|less|sass|scss)+(?:\.\w+)?$/i)
      .resourceQuery(/module=true/)
      .type('css/module');

    const { default: VueLoaderPlugin } =
      await import('@best-shot/vue-loader/dist/pluginWebpack5.js');

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
