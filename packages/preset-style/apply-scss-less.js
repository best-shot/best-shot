const extToRegexp = require('ext-to-regexp');
const pickBy = require('lodash/pickBy');

module.exports = function applyScssLess({ mode }) {
  return chain =>
    chain.batch(config => {
      const fileRegexp = config.module.rule('style').get('test');
      return config.module
        .rule('style')
        .test(fileRegexp.add('scss', 'sass', 'less'))
        .end()
        .rule('sass')
        .test(extToRegexp('scss', 'sass'))
        .use('sass-loader')
        .loader('sass-loader')
        .options(
          pickBy(
            {
              sourceMap: mode === 'development',
              outputStyle: mode === 'development' ? 'expanded' : undefined
            },
            item => item !== undefined
          )
        )
        .end()
        .end()
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
