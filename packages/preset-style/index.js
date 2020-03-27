const slashToRegexp = require('slash-to-regexp');
const { relative } = require('@best-shot/core/lib/path');

const applyFont = require('./lib/apply-font');
const applyImage = require('./lib/apply-image');
const applyScssLess = require('./lib/apply-scss-less');
const applyStylesheet = require('./lib/apply-stylesheet');

exports.apply = function applyStyle({
  config: {
    experimental: { sassResolveUrl = false, lessJavascriptEnabled = false } = {}
  }
}) {
  return chain => {
    const context = chain.get('context');

    chain
      .batch(applyStylesheet)
      .batch(applyScssLess({ sassResolveUrl, lessJavascriptEnabled }))
      .batch(applyImage)
      .batch(applyFont);

    chain.resolveLoader.modules.prepend(relative(context, module.paths[0]));

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'))
        .add(slashToRegexp('/node_modules/extract-css-chunks-webpack-plugin/'));
    }
  };
};

exports.schema = {
  experimental: {
    properties: {
      sassResolveUrl: {
        type: 'boolean',
        default: false
      },
      lessJavascriptEnabled: {
        type: 'boolean',
        default: false
      }
    }
  }
};
