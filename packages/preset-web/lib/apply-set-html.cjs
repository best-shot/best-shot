const deepmerge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { relative } = require('@best-shot/core/lib/path');

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

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

const fallback = {
  template: './src/index.html',
  title: 'BEST-SHOT Project',
};

exports.setHtml = function setHtml({ html = {}, define, sri }) {
  return (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const context = chain.get('context');
    const publicPath = chain.output.get('publicPath');
    const minimize = chain.optimization.get('minimize');

    const page = Array.isArray(html) ? html : [html];

    page.forEach((options, index) => {
      chain.plugin(`html-page-${index}`).use(HtmlWebpackPlugin, [
        deepmerge.all(
          [
            {
              template: './src/index.html',
              title: 'BEST-SHOT Project',
              cache: watch,
            },
            index > 0 ? page[0] : {},
            options,
            {
              templateParameters: {
                publicPath,
                title: options.title || fallback.title,
                ...(define && { define }),
              },
              minify: minimize ? htmlMinifier : false,
            },
          ],
          { arrayMerge: overwriteMerge },
        ),
      ]);
    });

    if (mode === 'production' && sri) {
      chain.output.crossOriginLoading('anonymous');

      chain
        .plugin('subresource-integrity')
        .use(SubresourceIntegrityPlugin, [{ enabled: true }]);
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
