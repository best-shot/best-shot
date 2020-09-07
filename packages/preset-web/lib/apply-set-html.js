const deepmerge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');
const SubresourceIntegrityPlugin = require('webpack-subresource-integrity');
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

exports.setHtml = function setHtml({ html = [], define, sri }) {
  return (chain) => {
    const mode = chain.get('mode');
    const context = chain.get('context');
    const publicPath = chain.output.get('publicPath');
    const minimize = chain.optimization.get('minimize');

    html.forEach((options, index) => {
      chain.plugin(`html-page-${index}`).use(HtmlWebpackPlugin, [
        deepmerge.all(
          [
            index > 0 ? html[0] : {},
            options,
            {
              templateParameters: {
                publicPath,
                title: options.title,
                ...(define && { define }),
              },
              scriptLoading: 'defer',
              inject: 'head',
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
        .use(SubresourceIntegrityPlugin, [
          { hashFuncNames: ['sha512', 'sha384', 'sha256'] },
        ]);
    }

    chain.module
      .rule('micro-tpl')
      .test(extToRegexp({ extname: ['html'] }))
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
