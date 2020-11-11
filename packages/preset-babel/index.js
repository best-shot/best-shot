const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

const { relative } = require('@best-shot/core/lib/path');

exports.name = 'preset-babel';

exports.apply = function applyBabel({ config: { polyfill = false } }) {
  return (chain) => {
    const mode = chain.get('mode');
    const context = chain.get('context');
    const UseCache = chain.get('watch');

    chain.module
      .rule('babel')
      .test(extToRegexp({ extname: ['js', 'mjs', 'cjs'] }))
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        envName: mode,
        sourceType: 'unambiguous',
        cacheDirectory: UseCache,
        ...(UseCache ? { cacheCompression: false } : undefined),
        compact: mode === 'production',
        presets: [['evergreen', { polyfill }]],
        plugins: [
          // for webpack v4
          '@babel/proposal-optional-chaining',
          '@babel/proposal-nullish-coalescing-operator',
        ],
      });

    const isServing = chain.devServer.entries() !== undefined;

    chain.module
      .rule('babel')
      .exclude.add(
        slashToRegexp(
          isServing
            ? '/node_modules/webpack(-dev-server)?/'
            : '/node_modules/webpack/',
        ),
      )
      .when(polyfill, (exclude) =>
        exclude.add(slashToRegexp('/node_modules/core-js(-pure)?/')),
      );

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));
  };
};

exports.schema = {
  polyfill: {
    default: false,
    description: 'References: <https://github.com/babel/babel/issues/10008>',
    enum: [false, 'global', 'pure'],
    title: 'How `babel` handles polyfills',
  },
};
