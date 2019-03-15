const suffix = require('suffix');

const setOutputName = require('./batch-set-output-name');
const splitChunks = require('./batch-split-chunks');
const setHtml = require('./batch-set-html');

function addHash(filename) {
  return suffix(filename, '.[contenthash:8]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

function sourceMap(mode = 'development', serve = false) {
  return mode === 'production'
    ? false
    : serve
    ? 'cheap-module-eval-source-map'
    : 'cheap-module-source-map';
}

exports.name = 'preset-web';

exports.apply = function applySinglePage({
  mode,
  options: { serve },
  config: { html, vendors, define }
}) {
  return chain => {
    const useHot = chain.devServer.get('hot');
    const minimize = chain.optimization.get('minimize');
    return chain
      .devtool(sourceMap(mode, serve))
      .when(minimize, config => setOutputName(config, { both: addMin }))
      .when(!useHot, config => setOutputName(config, { both: addHash }))
      .batch(config =>
        setOutputName(config, {
          script: filename => `script/${filename}`,
          style: filename => `style/${filename}`
        })
      )
      .batch(config => splitChunks(config, { serve, vendors }))
      .batch(config => setHtml(config, { html, define }));
  };
};

const regexpFormat = {
  format: 'regex',
  minLength: 1,
  type: 'string'
};

const htmlOptionsFormat = {
  type: 'object',
  minProperties: 1
};

exports.schema = {
  html: {
    oneOf: [
      {
        title: 'Single Page Application',
        ...htmlOptionsFormat
      },
      {
        item: htmlOptionsFormat,
        minItems: 2,
        title: 'Multiple Page Application',
        type: 'array'
      }
    ],
    title: 'Options of HtmlWebpackPlugin'
  },
  polyfill: {
    default: 'usage'
  },
  vendors: {
    additionalProperties: {
      oneOf: [
        regexpFormat,
        {
          item: regexpFormat,
          minItems: 1,
          type: 'array',
          uniqueItems: true
        }
      ]
    },
    type: 'object'
  }
};
