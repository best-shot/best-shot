const deepmerge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath, objectFilter } = require('@best-shot/core/lib/common');

function getPkg(path) {
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const {
      name,
      version,
      description
      // TODO more
    } = require(path);
    return objectFilter({ name, version, description });
  } catch (error) {
    return {};
  }
}

module.exports = function setHtml(
  chain,
  { html = {}, define, minimize = false }
) {
  const defaultOptions = {
    inject: 'head',
    minify: {
      removeComments: minimize,
      collapseWhitespace: minimize
    },
    filename: 'index.html',
    template: currentPath('./src/index.html'),
    templateParameters: objectFilter({
      define,
      package: getPkg(currentPath('package.json'))
    })
  };

  const htmlOptions = Array.isArray(html) ? html : [html];

  htmlOptions.forEach(({ title = 'BEST-SHOT Project', ...options }, index) => {
    const { title: _, ...extend } = index > 0 ? htmlOptions[0] : {};

    chain
      .plugin(`html-multiple-page-${index}`)
      .use(HtmlWebpackPlugin, [
        deepmerge.all([
          defaultOptions,
          extend,
          options,
          { templateParameters: { title } }
        ])
      ])
      .end();
  });

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
