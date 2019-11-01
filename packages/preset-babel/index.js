'use strict';

const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

const { relative, child } = require('@best-shot/core/lib/path');

exports.name = 'preset-babel';

exports.apply = function applyBabel({
  browsers = 'defaults',
  config: { polyfill = false }
}) {
  return chain => {
    const mode = chain.get('mode');
    const context = chain.get('context');

    chain.module
      .rule('babel')
      .test(extToRegexp({ extname: ['js', 'mjs', 'cjs'] }))
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        sourceType: 'unambiguous',
        cacheDirectory: mode === 'development',
        compact: mode === 'production',
        presets: [
          [
            `module:${child(context, __dirname, 'preset')}`,
            {
              polyfill,
              targets: { browsers }
            }
          ]
        ]
      });

    if (polyfill) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/core-js/'))
        .add(slashToRegexp('/node_modules/core-js-pure/'));
    }

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));
  };
};

exports.schema = {
  polyfill: {
    default: false,
    description: 'References: <https://github.com/babel/babel/issues/10008>',
    enum: [false, 'usage', 'pure'],
    title: 'How `babel` handles polyfills'
  }
};
