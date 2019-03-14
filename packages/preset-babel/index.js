const extToRegexp = require('ext-to-regexp');

const displayName = 'babel';

exports.name = displayName;

exports.apply = function applyBabel({
  browsers,
  mode = 'production',
  config: { polyfill = false }
}) {
  return chain => {
    chain.module
      .rule(displayName)
      .test(extToRegexp('js', 'mjs'))
      .exclude.add(/[\\/]node_modules[\\/]core-js[\\/]/)
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
              useBuiltIns: polyfill,
              targets: { browsers }
            }
          ]
        ],
        plugins: [
          '@babel/syntax-dynamic-import',
          '@babel/proposal-export-namespace-from',
          '@babel/proposal-numeric-separator',
          ['@babel/proposal-decorators', { legacy: true }],
          '@babel/proposal-class-properties'
        ]
      });
  };
};

exports.schema = {
  polyfill: {
    default: false,
    title: '@babel/preset-env options: `useBuiltIns`',
    description:
      'To know how babel handles polyfills, See <https://babeljs.io/docs/en/babel-preset-env#usebuiltins>.',
    enum: ['entry', 'usage', false]
  }
};
