import extToRegexp from 'ext-to-regexp';

import { nonAscii, removeRoot } from './utils.mjs';

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

export function applyData(chain) {
  const yaml = chain.module
    .rule('yaml')
    .test(extToRegexp({ extname: ['yaml', 'yml'] }));

  yaml
    .oneOf('external')
    .test(/\.\[hash]/)
    .batch(outputFile('.json'))
    .end()

    .oneOf('internal')
    .set('dependency', { not: 'url' })
    .type('json')
    .end()

    .oneOf('url')
    .batch(outputFile('.json'))
    .end()

    .use('yaml-loader')
    .loader('yaml-loader')
    .options({ asJSON: true });
}
