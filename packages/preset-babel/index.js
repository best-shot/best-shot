'use strict';

const slash = require('slash');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');
const { currentPath } = require('@best-shot/core/lib/common');

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
            slash(`module:.\\${currentPath.relative(__dirname, 'preset')}`),
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

    const childNodeModules = currentPath.relative(module.paths[0]);

    chain.resolveLoader.modules.add(childNodeModules);
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
