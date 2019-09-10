'use strict';

const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

const childNodeModules = currentPath.relative(module.paths[0]);

const displayName = 'babel';

exports.name = displayName;

exports.apply = function applyBabel({
  browsers = 'defaults',
  mode = 'production',
  config: { polyfill = false }
}) {
  return chain => {
    chain.module
      .rule(displayName)
      .test(extToRegexp('js', 'mjs'))
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
              targets: { browsers }
            }
          ]
        ],
        plugins: [
          '@babel/proposal-export-namespace-from',
          '@babel/proposal-numeric-separator',
          ['@babel/proposal-decorators', { legacy: true }],
          '@babel/proposal-class-properties'
        ]
      });

    if (polyfill) {
      chain.module
        .rule(displayName)
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
    enum: ['entry', 'usage', false]
  }
};
