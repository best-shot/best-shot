const suffix = require('suffix');

const addPolyfill = require('./batch--add-polyfill');
const setOutputName = require('./batch--set-output-name');
const splitChunks = require('./batch--split-chunks');
const setHtml = require('./batch--set-html');

function addHash(filename) {
  return suffix(filename, '.[contenthash:8]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

exports.name = 'preset-web';

exports.apply = function applySinglePage({
  mode,
  options: { serve },
  config: {
    html, polyfill, vendors, define
  }
}) {
  return chain => {
    const useHot = chain.devServer.get('hot');
    const minimize = chain.optimization.get('minimize');
    return chain
      .devtool(
        mode === 'production'
          ? false
          : serve
            ? 'cheap-module-eval-source-map'
            : 'cheap-module-source-map'
      )
      .when(minimize, config => setOutputName(config, { both: addMin, useHot }))
      .when(!useHot, config => setOutputName(config, { both: addHash, useHot }))
      .batch(config =>
        setOutputName(config, {
          script: filename => `script/${filename}`,
          style: filename => `style/${filename}`,
          useHot
        })
      )
      .when(polyfill, config => addPolyfill(config, { polyfill }))
      .batch(config => splitChunks(config, { serve, vendors }))
      .batch(config => setHtml(config, { html, define, minimize }));
  };
};

const string = { type: 'string', minLength: 1 };

exports.schema = {
  html: {
    description: '单入口 HtmlPlugin 设置，会与预设合并',
    type: 'object'
  },
  polyfill: {
    default: 'entry',
    description: '导入 Babel-Polyfill 方式',
    enum: ['entry', 'usage', false]
  },
  vendors: {
    type: 'object',
    minProperties: 1,
    additionalProperties: {
      oneOf: [
        string,
        {
          type: 'array',
          minItems: 1,
          uniqueItems: true,
          item: string
        }
      ]
    }
  }
};
