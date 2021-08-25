'use strict';

const deepmerge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {
  default: HtmlWebpackInjectPlugin,
} = require('html-webpack-inject-plugin');
const { relative } = require('path');

function mergeAll(...options) {
  return deepmerge.all(options, {
    arrayMerge: (destinationArray, sourceArray) => sourceArray,
  });
}

const htmlMinifier = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
};

exports.setHtml = function setHtml({ html = {}, inject = [], define, sri }) {
  return (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const context = chain.get('context');
    const minimize = chain.optimization.get('minimize');

    const page = Array.isArray(html) ? html : [html];

    page.forEach((options, index) => {
      chain.plugin(`html-page-${index}`).use(HtmlWebpackPlugin, [
        mergeAll(
          {
            ...(define && { templateParameters: { define } }),
            template: './src/index.html',
            cache: watch,
          },
          index > 0 ? page[0] : {},
          options,
          { minify: minimize ? htmlMinifier : false },
        ),
      ]);
    });

    if (inject.length > 0) {
      chain
        .plugin('inject')
        .use(HtmlWebpackInjectPlugin, [{ externals: inject }]);
    }

    if (mode === 'production' && sri) {
      chain.output.crossOriginLoading('anonymous');

      chain.plugin('subresource-integrity').use(SubresourceIntegrityPlugin);
    }

    chain.module
      .rule('micro-tpl')
      .test(extToRegexp({ extname: ['html', 'htm'] }))
      .use('micro-tpl-loader')
      .loader('micro-tpl-loader');

    chain.resolveLoader.modules.prepend(relative(context, module.paths[1]));

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/micromustache/'));
    }
  };
};
