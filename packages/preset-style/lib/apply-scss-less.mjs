import extToRegexp from 'ext-to-regexp';

function addExtname(rule) {
  const regexp = rule.get('test');
  rule.test(regexp.add('scss', 'sass', 'less'));
}

export function applyScssLess(less) {
  return (chain) => {
    chain.module.rule('style').batch(addExtname);

    chain.module
      .rule('sass')
      .after('style')
      .test(extToRegexp({ extname: ['scss', 'sass'] }))
      .use('resolve-url-loader')
      .loader('resolve-url-loader')
      .options({
        sourceMap: true,
        removeCR: true,
      })
      .end()
      .use('sass-loader')
      .loader('sass-loader')
      .options({
        sourceMap: true,
      });

    chain.module
      .rule('less')
      .after('style')
      .test(extToRegexp({ extname: ['less'] }))
      .use('less-loader')
      .loader('less-loader')
      .options({
        lessOptions: {
          rewriteUrls: 'local',
          ...less,
        },
      });
  };
}
