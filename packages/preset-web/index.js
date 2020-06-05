const suffix = require('suffix');

const { setOutputName } = require('./lib/apply-set-output-name');
const { splitChunks } = require('./lib/apply-split-chunks');
const { setHtml } = require('./lib/apply-set-html');

function addHash(filename) {
  return suffix(filename, '.[contenthash:8]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

exports.name = 'preset-web';

exports.apply = function applyWeb({ config: { html, vendors, define, sri } }) {
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
      .batch(setHtml({ sri, html, define }));
  };
};

const regexpFormat = {
  format: 'regex',
  minLength: 1,
  type: 'string',
};

function polyfill() {
  try {
    // eslint-disable-next-line global-require,import/no-extraneous-dependencies,node/no-extraneous-require
    return require('@best-shot/preset-babel').schema.polyfill.enum[1];
  } catch {
    return false;
  }
}

exports.schema = {
  html: {
    default: [{}],
    items: {
      type: 'object',
      properties: {
        title: {
          minLength: 1,
          type: 'string',
          default: 'BEST-SHOT Project',
        },
        filename: {
          minLength: 1,
          type: 'string',
        },
        template: {
          minLength: 1,
          type: 'string',
          default: './src/index.html',
        },
      },
    },
    minItems: 1,
    type: 'array',
    uniqueItems: true,
    title: 'Options group of HtmlWebpackPlugin',
  },
  polyfill: {
    default: polyfill(),
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
};
