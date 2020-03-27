const extToRegexp = require('ext-to-regexp');

function addExtname(rule) {
  const regexp = rule.get('test');

  rule.test(regexp.add('scss', 'sass', 'less'));
}

module.exports = function applyScssLess({
  sassResolveUrl,
  lessJavascriptEnabled
}) {
  return chain => {
    const isDevelopment = chain.get('mode') === 'development';

    chain.module.rule('style').batch(addExtname);

    function useResolveUrl(rule) {
      rule
        .use('resolve-url-loader')
        .loader('resolve-url-loader')
        .options({
          sourceMap: isDevelopment,
          keepQuery: true,
          removeCR: true
        });
    }

    chain.module
      .rule('sass')
      .test(extToRegexp({ extname: ['scss', 'sass'] }))
      .when(sassResolveUrl, useResolveUrl)
      .use('sass-loader')
      .loader('sass-loader')
      .options({ sourceMap: isDevelopment })
      .when(isDevelopment, io =>
        io.tap(options => ({
          ...options,
          sassOptions: {
            outputStyle: 'expanded'
          }
        }))
      );

    chain.module
      .rule('less')
      .test(extToRegexp({ extname: ['less'] }))
      .use('less-loader')
      .loader('less-loader')
      .options({
        sourceMap: isDevelopment,
        javascriptEnabled: lessJavascriptEnabled
      });
  };
};
