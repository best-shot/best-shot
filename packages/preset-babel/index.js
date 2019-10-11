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
              useBuiltIns: polyfill,
              corejs: 3,
              spec: true,
              targets: { browsers }
            }
          ]
        ],
        plugins: [
          polyfill
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
    description:
      'How @babel/preset-env handles polyfills, See <https://babeljs.io/docs/en/babel-preset-env>.',
    title: '`options.useBuiltIns` of @babel/preset-env',
    enum: ['usage', false]
  }
};
