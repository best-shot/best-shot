'use strict';

const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

const { relative } = require('path');
const { loadConfig, defaults } = require('browserslist');

function getList(path) {
  const config = loadConfig({ path });
  return config && config.length > 0 ? config : defaults;
}

exports.name = 'preset-babel';

exports.apply = function applyBabel({
  config: {
    polyfill: old = false,
    babel: { polyfill = old, env = 'always' } = {},
  },
}) {
  return (chain) => {
    const mode = chain.get('mode');
    const context = chain.get('context');
    const watch = chain.get('watch');

    const skip = env === 'auto' && watch;

    chain.module
      .rule('babel')
      .test(extToRegexp({ extname: ['js', 'mjs', 'cjs', 'ts'] }))
      .merge({
        resolve: { fullySpecified: false },
      })
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        cacheCompression: false,
        cacheDirectory: watch,
        compact: mode === 'production',
        envName: mode,
        sourceType: 'unambiguous',
        targets: getList(context),
        presets: skip
          ? ['@babel/typescript']
          : [['evergreen', { polyfill }], '@babel/typescript'],
      });

    const isServing = chain.devServer.entries() !== undefined;

    chain.module
      .rule('babel')
      .exclude.add(
        slashToRegexp(
          skip
            ? '/node_modules/'
            : isServing
            ? '/node_modules/webpack(-dev-server)?/'
            : '/node_modules/webpack/buildin/',
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
    description: 'Use `babel.polyfill` instead',
  },
  babel: {
    type: 'object',
    properties: {
      polyfill: {
        // default: false,
        description:
          'References: <https://github.com/babel/babel/issues/10008>',
        enum: [false, 'global', 'pure'],
        title: 'How `babel` handles polyfills',
      },
      env: {
        default: 'always',
        enum: ['auto', 'always'],
        description:
          "When 'auto', `babel-preset-evergreen` will skip in watch mode",
      },
    },
  },
};
