import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';

function batchLess(rule) {
  rule
    .use('less-loader')
    .loader(fileURLToPath(import.meta.resolve('less-loader')))
    .options({
      lessOptions: {
        rewriteUrls: 'local',
      },
    });
}

function batchSass(rule) {
  rule
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
}

export function applyScssLess({ dataURI }) {
  return (chain) => {
    chain.module
      .rule('sass')
      .test(extToRegexp({ extname: ['scss', 'sass'] }))
      .batch(batchSass);

    if (dataURI) {
      chain.module
        .rule('sass-uri')
        .after('sass')
        .mimetype(['text/scss', 'text/sass'])
        .batch(batchSass);
    }

    chain.module
      .rule('less')
      .after('sass-uri')
      .test(extToRegexp({ extname: ['less'] }))
      .batch(batchLess);

    if (dataURI) {
      chain.module
        .rule('less-uri')
        .after('less')
        .mimetype('text/less')
        .batch(batchLess);
    }
  };
}
