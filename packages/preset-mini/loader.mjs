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
    .loader('@into-mini/sfc-split-loader/dist/index.mjs');

  vueRule
    .rule('extract-vue-template')
    .test(vueRegexp)
    .issuer(vueRegexp)
    .resourceQuery(/type=template/)
    .type('asset/resource')
    .generator.filename('[entry].wxml')
    .end()
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs');

  vueRule
    .rule('extract-vue-config')
    .test(vueRegexp)
    .issuer(vueRegexp)
    .resourceQuery(/type=config&lang=json/)
    .type('asset/resource')
    .generator.filename('[entry].json')
    .end()
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs');

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
    .loader('@into-mini/sfc-split-loader/dist/index.mjs');

  vueRule
    .rule('split-vue')
    .issuer({ not: vueRegexp })
    .resourceQuery({ not: /type=/ })
    .type('javascript/esm')
    .use('sfc-split-loader')
    .loader('@into-mini/sfc-split-loader/dist/index.mjs');

  // vueRule
  //   .rule('pre-vue').issuer({ not: vueRegexp })
  //   .resourceQuery({ not: /type=/ })
  //   .use('sfc-split-loader')
  // .use('sfc-split-pre')
  // .loader('@into-mini/sfc-split-loader/dist/next.mjs')
  // .options(options)
}
