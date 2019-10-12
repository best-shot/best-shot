'use strict';

const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

const childNodeModules = currentPath.relative(module.paths[0]);

exports.name = 'preset-babel';

exports.apply = function applyBabel({
  browsers = 'defaults',
  config: { polyfill = false }
}) {
  return chain => {
    const mode = chain.get('mode');

    chain.module
      .rule('babel')
      .test(extToRegexp({ extname: ['js', 'mjs'] }))
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        sourceType: 'unambiguous',
        cacheDirectory: mode === 'development',
        compact: mode === 'production',
        presets: [
          [
            '@babel/env',
            {
              modules: false,
              // @ts-ignore
              useBuiltIns: polyfill === 'pure' ? false : polyfill,
              // @ts-ignore
              corejs: polyfill === 'usage' ? 3 : undefined,
              spec: true,
              targets: { browsers }
            }
          ]
        ],
        plugins: [
          // @ts-ignore
          polyfill === 'pure'
            ? [
                '@babel/transform-runtime',
                {
                  corejs: 3,
                  useESModules: true
                }
              ]
            : false,
          '@babel/proposal-export-namespace-from',
          ['@babel/proposal-decorators', { legacy: true }],
          '@babel/proposal-class-properties'
        ].filter(Boolean)
      });

    if (polyfill) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/core-js/'));
    }

    chain.resolveLoader.modules.add(childNodeModules);
  };
};

exports.schema = {
  polyfill: {
    default: false,
    description: 'See <https://github.com/babel/babel/issues/10008>.',
    enum: [false, 'usage', 'pure'],
    title: 'How `@babel/preset-env` handles polyfills'
  }
};
