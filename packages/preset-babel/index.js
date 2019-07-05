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
  config: {
    polyfill: { useBuiltIns, corejs }
  }
}) {
  return chain => {
    chain.module
      .rule(displayName)
      .test(extToRegexp('js', 'mjs'))
      .exclude.add(slashToRegexp('/node_modules/core-js/'))
      .end()
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
              useBuiltIns,
              corejs,
              targets: { browsers }
            }
          ]
        ],
        plugins: [
          '@babel/syntax-import-meta',
          '@babel/proposal-export-namespace-from',
          '@babel/proposal-numeric-separator',
          ['@babel/proposal-decorators', { legacy: true }],
          '@babel/proposal-class-properties'
        ]
      });

    chain.resolveLoader.modules.add(childNodeModules);
  };
};

exports.schema = {
  polyfill: {
    default: {},
    description:
      'How @babel/preset-env handles polyfills, See <https://babeljs.io/docs/en/babel-preset-env>.',
    properties: {
      corejs: {
        default: 3,
        description:
          '`options.corejs` of @babel/preset-env, but `options.corejs.proposals` always be false',
        enum: [2, 3]
      },
      useBuiltIns: {
        default: false,
        description: '`options.useBuiltIns` of @babel/preset-env.',
        enum: ['entry', 'usage', false]
      }
    },
    required: ['useBuiltIns', 'corejs'],
    title: 'Two options of @babel/preset-env',
    type: 'object'
  }
};
