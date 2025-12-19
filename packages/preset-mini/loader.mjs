import extToRegexp from 'ext-to-regexp';

export function applyLoaders(chain, options) {
  const babelRule = chain.module.rule('babel');

  const vueRegexp = extToRegexp({ extname: ['vue'] });

  const vueRule = chain.module.rule('vue-file').test(vueRegexp);

  vueRule
    .rule('extract-vue-javascript')
    .test(vueRegexp)
    .issuer(vueRegexp)
    .resourceQuery(/type=script/)
    .type('javascript/esm')
    .use('babel-loader')
    .merge(babelRule.use('babel-loader').entries())
    .end()
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs')
    .options(options);

  vueRule
    .rule('extract-vue-template')
    .test(vueRegexp)
    .issuer(vueRegexp)
    .resourceQuery(/type=template/)
    .type('asset/resource')
    .generator.filename('[entry][hash:8].wxml')
    .end()
    .use('wxml-loader')
    .loader('@into-mini/wxml-loader')
    .end()
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs')
    .options(options);

  vueRule
    .rule('extract-vue-config')
    .test(vueRegexp)
    .issuer(vueRegexp)
    .resourceQuery(/type=config&lang=(yaml|json)/)
    .type('asset/resource')
    .generator.filename('[entry][hash:8].json')
    .end()
    .use('entry-loader')
    .loader('@into-mini/sfc-split-plugin/dist/loader/entry-loader.mjs')
    .end()
    .use('yaml-loader')
    .loader('yaml-patch-loader')
    .end()
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs')
    .options(options);

  const xRule = vueRule
    .rule('extract-vue-style')
    .test(vueRegexp)
    .issuer(vueRegexp)
    .resourceQuery(/type=style/);

  const styleRule = chain.module.rule('style');

  for (const name of ['all', 'postcss', 'sass', 'less']) {
    xRule.rule(name).merge(styleRule.rule(name).toConfig());
  }

  xRule
    .rule('sass')
    .delete('test')
    .resourceQuery(/type=style&lang=scss/);

  xRule
    .rule('less')
    .delete('test')
    .resourceQuery(/type=style&lang=less/);

  xRule
    .rule('extract')
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs')
    .options(options);

  vueRule
    .rule('split-vue')
    .resourceQuery({ not: /type=/ })
    .type('javascript/esm')
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs')
    .options(options);
}
