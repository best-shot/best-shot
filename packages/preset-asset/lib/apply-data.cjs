'use strict';

const extToRegexp = require('ext-to-regexp');

const { nonAscii, removeRoot } = require('./utils.cjs');

function outputFile(ext = '[ext]') {
  return (rule) => {
    rule.type('asset/resource').set('generator', {
      filename: (args) => {
        // eslint-disable-next-line no-param-reassign
        args.filename = nonAscii(
          removeRoot(args.filename).replace('.[hash]', ''),
        );

        return `[path][name].[contenthash:8]${ext}`;
      },
    });
  };
}

module.exports = function applyData(chain) {
  chain.module
    .rule('json')
    .test(
      extToRegexp({
        suffix: ['\\[hash]'],
        extname: ['json'],
      }),
    )
    .type('javascript/auto')
    .batch(outputFile());

  // ----------

  const yaml = chain.module
    .rule('yaml')
    .test(extToRegexp({ extname: ['yaml', 'yml'] }));

  yaml
    .oneOf('external')
    .test(/\.\[hash]/)
    .batch(outputFile('.json'))
    .end()

    .oneOf('internal')
    .set('dependency', { not: ['url'] })
    .type('json')
    .end()

    .oneOf('url')
    .batch(outputFile('.json'))
    .end()

    .use('yaml-loader')
    .loader('yaml-loader');

  // ----------

  const text = chain.module
    .rule('text')
    .test(extToRegexp({ extname: ['txt'] }));

  text
    .oneOf('external')
    .test(/\.\[hash]/)
    .batch(outputFile());

  text // align
    .oneOf('internal')
    .type('asset/source');
};
