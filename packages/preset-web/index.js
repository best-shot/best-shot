'use strict';

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
  rootPath,
  options: { serve = false },
  config: { html, vendors, define, publicPath, sri }
}) {
  return chain => {
    const useHot = chain.devServer.get('hot');
    const minimize = chain.optimization.get('minimize');
    chain.devtool(sourceMap(mode, serve));

    chain
      .when(minimize, setOutputName({ style: addMin, script: addMin }))
      .when(!useHot, setOutputName({ style: addHash, script: addHash }))
      .batch(
        setOutputName({
          script: filename => `script/${filename}`,
          style: filename => `style/${filename}`
        })
      );

    chain.batch(config => splitChunks(config, { vendors }));
    chain.batch(config =>
      setHtml(config, {
        sri,
        mode,
        html,
        define,
        minimize,
        rootPath,
        publicPath
      })
    );
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
    default: false,
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
