import suffix from 'suffix';

import { setHtml } from './lib/apply-set-html.mjs';
import { setOutputName } from './lib/apply-set-output-name.mjs';

function addHash(filename) {
  return filename.includes('contenthash')
    ? filename
    : suffix(filename, '.[contenthash]');
}

function addMin(filename) {
  return suffix(filename, '.min');
}

export function apply({ config: { html } }) {
  return async (chain) => {
    const mode = chain.get('mode');

    chain.output.assetModuleFilename(
      mode === 'development' ? '[path][name][ext]' : '[contenthash][ext]',
    );

    const minimize = chain.optimization.get('minimize');
    const serve = chain.devServer.entries() !== undefined;
    const hot = (serve && chain.devServer.get('hot')) || false;

    chain.devtool(mode === 'production' ? false : 'source-map');

    chain
      .when(minimize, setOutputName({ style: addMin, script: addMin }))
      .when(!hot, setOutputName({ style: addHash, script: addHash }))
      .batch(
        setOutputName({
          script: (filename) => `script/${filename}`,
          style: (filename) => `style/${filename}`,
        }),
      );

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

      const { cachePath } = chain.get('x');

      chain.recordsPath(cachePath('records.json'));
    }
  };
}

export const name = 'preset-web';

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
  optimization: {
    type: 'object',
    default: {},
    properties: {
      runtimeChunk: {
        default: true,
      },
      splitChunks: {
        default: true,
      },
    },
  },
};
