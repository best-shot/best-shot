const extToRegexp = require('ext-to-regexp');

function addExtname(rule) {
  const regexp = rule.get('test');
  rule.test(regexp.add('scss', 'sass', 'less'));
}

module.exports = function applyScssLess(chain) {
  chain.module.rule('style').batch(addExtname);

  chain.module
    .rule('sass')
    .test(extToRegexp({ extname: ['scss', 'sass'] }))
    .use('resolve-url-loader')
    .loader('resolve-url-loader')
    .options({
      sourceMap: !['eval', false].includes(chain.get('devtool')),
      keepQuery: true,
      removeCR: true,
    })
    .end()
    .use('sass-loader')
    .loader('sass-loader');

  chain.module
    .rule('less')
    .test(extToRegexp({ extname: ['less'] }))
    .use('less-loader')
    .loader('less-loader')
    .options({ lessOptions: { rewriteUrls: 'local' } });
};
