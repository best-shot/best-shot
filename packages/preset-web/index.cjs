'use strict';

const suffix = require('suffix');

const { setOutputName } = require('./lib/apply-set-output-name.cjs');
const { splitChunks } = require('./lib/apply-split-chunks.cjs');
const { setHtml } = require('./lib/apply-set-html.cjs');

function addHash(filename) {
  return suffix(filename, '.[contenthash:8]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

exports.name = 'preset-web';

function isInstalled() {
  try {
    require.resolve('@road-to-rome/webpack-plugin/package.json');
    return true;
  } catch {
    return false;
  }
}

exports.apply = function applyWeb({
  config: { html, inject, vendors, define, sri, rtr },
}) {
  return (chain) => {
    const mode = chain.get('mode');
    const hot = chain.devServer.get('hot') || false;
    const minimize = chain.optimization.get('minimize');
    const serve = chain.devServer.entries() !== undefined;

    chain.devtool(
      mode === 'production' ? false : serve ? 'eval-source-map' : 'source-map',
    );

    chain
      .when(minimize, setOutputName({ style: addMin, script: addMin }))
      .when(!hot, setOutputName({ style: addHash, script: addHash }))
      .batch(
        setOutputName({
          script: (filename) => `script/${filename}`,
          style: (filename) => `style/${filename}`,
        }),
      )
      .batch(splitChunks({ vendors }))
      .batch(setHtml({ sri, html, define, inject }));

    if (isInstalled()) {
      chain.plugin('road-to-rome').use('@road-to-rome/webpack-plugin', [rtr]);
    }
  };
};

const regexpFormat = {
  format: 'regex',
  minLength: 1,
  type: 'string',
};

const items = {
  type: 'object',
};

exports.schema = {
  html: {
    oneOf: [
      items,
      {
        items,
        minItems: 1,
        type: 'array',
        uniqueItems: true,
        title: 'Options group of HtmlWebpackPlugin',
      },
    ],
  },
  inject: {
    type: 'array',
    uniqueItems: true,
    items: {
      type: 'object',
    },
  },
  babel: {
    type: 'object',
    properties: {
      polyfill: {
        default: 'global',
      },
    },
  },
  sri: {
    default: true,
    type: 'boolean',
  },
  vendors: {
    additionalProperties: {
      oneOf: [
        regexpFormat,
        {
          items: regexpFormat,
          minItems: 1,
          type: 'array',
          uniqueItems: true,
        },
      ],
    },
    type: 'object',
  },
  rtr: {},
};
