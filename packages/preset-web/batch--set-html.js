const merge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

module.exports = function setHtml(chain, { html, minimize = false }) {
  const htmlOptions = {
    inject: 'head',
    minify: {
      removeComments: minimize,
      collapseWhitespace: minimize
    },
    template: currentPath('./src/index.html')
  };
  return chain
    .plugin('html-single-page')
    .use(HtmlWebpackPlugin, [html ? merge(htmlOptions, html) : htmlOptions])
    .end()
    .plugin('script-ext-html')
    .use(ScriptExtHtmlWebpackPlugin, [
      {
        defaultAttribute: 'defer'
      }
    ])
    .end()
    .module.rule('mustache')
    .test(extToRegexp('tpl'))
    .use('micro-tpl-loader')
    .loader('micro-tpl-loader');
};
