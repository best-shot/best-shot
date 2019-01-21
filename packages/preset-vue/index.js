const { relative, resolve } = require('path');
const extToRegexp = require('ext-to-regexp');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function currentPath(src = '') {
  return resolve(process.cwd(), src);
}

const childNodeModules = relative(
  currentPath(),
  resolve(__dirname, './node_modules')
);

exports.apply = function apply() {
  return chain => {
    const useHot = chain.devServer.get('hot');
    return (
      chain
        .when(useHot && chain.module.rules.has('style'), config =>
          config.module
            .rule('style')
            .use('style-loader')
            .loader('vue-style-loader')
        )
        .batch(config =>
          config.module
            .rule('vue')
            .test(extToRegexp('vue'))
            .use('vue-loader')
            .loader('vue-loader')
            .options({
              compilerOptions: {
                preserveWhitespace: false
              }
            })
        )
        // .batch(config => config.resolve.extensions.prepend('.vue'))
        .batch(config => config.resolveLoader.modules.add(childNodeModules))
        .batch(config => config.plugin('vue').use(VueLoaderPlugin))
    );
  };
};
