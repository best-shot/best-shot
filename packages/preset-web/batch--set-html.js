const merge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

function getPkg(path) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(path);
  } catch (error) {
    return {};
  }
}

module.exports = function setHtml(
  chain,
  {
    html: { title = 'BEST-SHOT Project', ...html } = {},
    define = {},
    minimize = false
  }
) {
  const {
    name, version, description, author
  } = getPkg(
    currentPath('package.json')
  );

  const htmlOptions = {
    inject: 'head',
    minify: {
      removeComments: minimize,
      collapseWhitespace: minimize
    },
    template: currentPath('./src/index.html'),
    templateParameters: {
      title,
      define,
      package: {
        name,
        version,
        description,
        author
        // TODO more
      }
    }
  };

  chain
    .plugin('html-single-page')
    .use(HtmlWebpackPlugin, [merge(htmlOptions, html)])
    .end();

  chain
    .plugin('script-ext-html')
    .use(ScriptExtHtmlWebpackPlugin, [{ defaultAttribute: 'defer' }])
    .end();

  chain.module
    .rule('mustache')
    .test(extToRegexp('tpl'))
    .use('micro-tpl-loader')
    .loader('micro-tpl-loader');
};
