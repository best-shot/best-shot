import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

function addExtname(rule) {
  const regexp = rule.get('test');
  rule.test(regexp.add('scss', 'sass', 'less'));
}

export function applyScssLess() {
  return (chain) => {
    chain.module.rule('style').batch(addExtname);

    chain.module
      .rule('sass')
      .test(extToRegexp({ extname: ['scss', 'sass'] }))
      .use('resolve-url-loader')
      .loader(fileURLToPath(import.meta.resolve('resolve-url-loader')))
      .options({
        sourceMap: true,
        removeCR: true,
      })
      .end()
      .use('sass-loader')
      .loader(fileURLToPath(import.meta.resolve('sass-loader')))
      .options({
        sourceMap: true,
      });

    chain.module
      .rule('less')
      .after('sass')
      .test(extToRegexp({ extname: ['less'] }))
      .use('less-loader')
      .loader(fileURLToPath(import.meta.resolve('less-loader')))
      .options({
        lessOptions: {
          rewriteUrls: 'local',
        },
      });
  };
}
