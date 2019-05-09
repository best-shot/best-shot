'use strict';

const deepmerge = require('deepmerge');
const extToRegexp = require('ext-to-regexp');
const slashToRegexp = require('slash-to-regexp');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath, objectFilter } = require('@best-shot/core/lib/common');

function getPkg(path) {
  try {
    const {
      name,
      version,
      description
      // TODO more
      // eslint-disable-next-line import/no-dynamic-require, global-require
    } = require(path);
    return name || version || description
      ? objectFilter({ name, version, description })
      : undefined;
  } catch (error) {
    return undefined;
  }
}

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

module.exports = function setHtml(chain, { html = {}, define }) {
  const defaultOptions = {
    inject: 'head',
    template: currentPath.relative('src', 'index.html'),
    templateParameters: objectFilter({
      title: 'BEST-SHOT Project',
      define,
      package: getPkg(currentPath.resolve('package.json'))
    })
  };

  const htmlOptions = (Array.isArray(html)
    ? html.length > 0
      ? html
      : [{}]
    : [html]
  ).map(({ title, templateParameters, ...options }) =>
    objectFilter({
      ...options,
      templateParameters:
        title || templateParameters
          ? objectFilter({ title, ...templateParameters })
          : undefined
    })
  );

  htmlOptions.forEach((options, index) => {
    chain
      .plugin(`html-page-${index}`)
      .use(HtmlWebpackPlugin, [
        deepmerge.all(
          [defaultOptions, index > 0 ? htmlOptions[0] : {}, options],
          { arrayMerge: overwriteMerge }
        )
      ])
      .end();
  });

  chain
    .plugin('script-ext-html')
    .use(ScriptExtHtmlWebpackPlugin, [{ defaultAttribute: 'defer' }]);

  chain.module
    .rule('micro-tpl')
    .test(extToRegexp('tpl'))
    .use('micro-tpl-loader')
    .loader('micro-tpl-loader');

  if (chain.module.rules.has('babel')) {
    chain.module
      .rule('babel')
      .exclude.add(slashToRegexp('/node_modules/micromustache/'));
  }
};
