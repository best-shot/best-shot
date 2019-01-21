const extToRegexp = require('ext-to-regexp');

const displayName = 'babel';

exports.name = displayName;

exports.apply = function applyBabel({ mode = 'production', browsers }) {
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
