'use strict';

const suffix = require('suffix');

const setOutputName = require('./lib/batch-set-output-name');
const splitChunks = require('./lib/batch-split-chunks');
const setHtml = require('./lib/batch-set-html');

function addHash(filename) {
  return suffix(filename, '.[contenthash:8]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

exports.name = 'preset-web';

exports.apply = function applySinglePage({
  config: { html, vendors, define, sri }
}) {
  return chain => {
    const mode = chain.get('mode');
    const hot = chain.devServer.get('hot');
    const minimize = chain.optimization.get('minimize');
    const serve = chain.devServer.entries();

    chain.devtool(
      mode === 'production'
        ? false
        : serve
        ? 'cheap-module-eval-source-map'
        : 'cheap-module-source-map'
    );

    chain
      .when(minimize, setOutputName({ style: addMin, script: addMin }))
      .when(!hot, setOutputName({ style: addHash, script: addHash }))
      .batch(
        setOutputName({
          script: filename => `script/${filename}`,
          style: filename => `style/${filename}`
        })
      )
      .batch(splitChunks({ vendors }))
      .batch(setHtml({ sri, html, define }));
  };
};

const regexpFormat = {
  format: 'regex',
  minLength: 1,
  type: 'string'
};

exports.schema = {
  html: {
    oneOf: [
      {
        additionalItems: {
          required: ['filename'],
          type: 'object'
        },
        items: [
          {
            type: 'object'
          }
        ],
        title: 'Multiple Page Application',
        type: 'array',
        uniqueItems: true
      },
      {
        title: 'Single Page Application',
        type: 'object'
      }
    ],
    title: 'Options of HtmlWebpackPlugin'
  },
  polyfill: {
    default: 'usage'
  },
  sri: {
    default: true,
    type: 'boolean'
  },
  vendors: {
    additionalProperties: {
      oneOf: [
        regexpFormat,
        {
          items: regexpFormat,
          minItems: 1,
          type: 'array',
          uniqueItems: true
        }
      ]
    },
    type: 'object'
  }
};
