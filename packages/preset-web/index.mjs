import suffix from 'suffix';

import { setHtml } from './lib/apply-set-html.mjs';
import { setOutputName } from './lib/apply-set-output-name.mjs';
import { splitChunks } from './lib/apply-split-chunks.mjs';

function addHash(filename) {
  return filename.includes('[contenthash')
    ? filename
    : suffix(filename, '.[contenthash]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

export function apply({ config: { html, vendors, optimization = {} } }) {
  return async (chain) => {
    const mode = chain.get('mode');
    const minimize = chain.optimization.get('minimize');
    const serve = chain.devServer.entries() !== undefined;
    const hot = (serve && chain.devServer.get('hot')) || false;

    chain.devtool(mode === 'production' ? false : 'source-map');

    chain
      .when(minimize, setOutputName({ style: addMin, script: addMin }))
      .when(!hot, setOutputName({ style: addHash, script: addHash }))
      .when(
        optimization.splitChunks !== false ||
          chain.optimization.get('runtimeChunk'),
        setOutputName({
          script: (filename) => `script/${filename}`,
          style: (filename) => `style/${filename}`,
        }),
      );

    if (optimization.splitChunks !== false) {
      await splitChunks({ vendors })(chain);
    }

    await setHtml({ html })(chain);

    if (mode === 'production') {
      const {
        default: {
          optimize: { MinChunkSizePlugin },
        },
      } = await import('webpack');
      chain
        .plugin('min-chunk-size')
        .use(MinChunkSizePlugin, [{ minChunkSize: 1024 * 8 }]);
    }
  };
}

export const name = 'preset-web';

const regexpFormat = {
  format: 'regex',
  minLength: 1,
  type: 'string',
};

const items = {
  type: 'object',
};

export const schema = {
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
  babel: {
    default: {},
    type: 'object',
    properties: {
      polyfill: {
        default: 'global',
      },
    },
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
    properties: {
      shim: {
        default: [
          '(.)*-(shim|polyfill)',
          '@babel',
          'core-js-(.)*',
          'core-js',
          'object-assign',
          'regenerator-runtime',
          'whatwg-fetch',
        ],
      },
    },
    default: {},
    required: ['shim'],
  },
  optimization: {
    type: 'object',
    properties: {
      runtimeChunk: {
        default: true,
      },
      splitChunks: {
        type: 'boolean',
      },
    },
  },
};
