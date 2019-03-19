const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

const childNodeModules = currentPath.relative(module.paths[0]);

exports.apply = function apply() {
  return chain => {
    const uses = chain.module.rule('style').uses.has('style-loader');
    if (uses) {
      chain.module
        .rule('style')
        .use('style-loader')
        .loader('vue-style-loader');
    }
    chain.module
      .rule('vue')
      .test(extToRegexp('vue'))
      .use('vue-loader')
      .loader('vue-loader')
      .options({
        compilerOptions: {
          preserveWhitespace: false
        }
      });
    chain.resolveLoader.modules.add(childNodeModules);
    chain.plugin('vue').use(VueLoaderPlugin);
  };
};
