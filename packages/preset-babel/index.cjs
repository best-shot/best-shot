const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

const { relative } = require('@best-shot/core/lib/path');
const { loadConfig, defaults } = require('browserslist');

function getList(path) {
  const config = loadConfig({ path });
  return config && config.length > 0 ? config : defaults;
}

exports.name = 'preset-babel';

exports.apply = function applyBabel({ config: { polyfill = false } }) {
  return (chain) => {
    const mode = chain.get('mode');
    const context = chain.get('context');
    const UseCache = chain.get('watch');

    chain.module
      .rule('babel')
      .test(extToRegexp({ extname: ['js', 'mjs', 'cjs'] }))
      .merge({
        resolve: { fullySpecified: false },
      })
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        cacheDirectory: UseCache,
        compact: mode === 'production',
        envName: mode,
        sourceType: 'unambiguous',
        targets: getList(context),
        ...(UseCache ? { cacheCompression: false } : undefined),
        presets: [['evergreen', { polyfill }]],
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
