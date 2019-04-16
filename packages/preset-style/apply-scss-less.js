const extToRegexp = require('ext-to-regexp');

// eslint-disable-next-line import/no-extraneous-dependencies
const { objectFilter } = require('@best-shot/core/lib/common');

module.exports = function applyScssLess({ mode }) {
  return chain => {
    chain.batch(config => {
      const fileRegexp = config.module.rule('style').get('test');
      config.module.rule('style').test(fileRegexp.add('scss', 'sass', 'less'));

      config.module
        .rule('sass')
        .test(extToRegexp('scss', 'sass'))
        .use('sass-loader')
        .loader('sass-loader')
        .options(
          objectFilter({
            sourceMap: mode === 'development',
            outputStyle: mode === 'development' ? 'expanded' : undefined
          })
        );

      config.module
        .rule('less')
        .test(extToRegexp('less'))
        .use('less-loader')
        .loader('less-loader')
        .options({
          sourceMap: mode === 'development',
          javascriptEnabled: true
        });
    });
  };
};
