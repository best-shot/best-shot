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

async function applyWeb(chain) {
  const mode = chain.get('mode');

  chain.output.assetModuleFilename(
    mode === 'development' ? '[path][name][ext]' : '[contenthash][ext]',
  );

  const minimize = chain.optimization.get('minimize');
  const isServed = chain.devServer.entries() !== undefined;
  const hot = (isServed && chain.devServer.get('hot')) || false;

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

  await setHtml(chain);

  if (mode !== 'production') return;

  const webpack = await import('webpack');
  const { MinChunkSizePlugin } = webpack.default.optimize;
  chain
    .plugin('min-chunk-size')
    .use(MinChunkSizePlugin, [{ minChunkSize: 1024 * 8 }]);

  const { cachePath } = chain.get('x');

  chain.recordsPath(cachePath('records.json'));
}

export function apply() {
  return applyWeb;
}

export const name = 'preset-web';

export const schema = {
  optimization: {
    type: 'object',
    default: {},
    properties: {
      runtimeChunk: {
        default: 'single',
      },
      splitChunks: {
        default: true,
      },
    },
  },
  output: {
    type: 'object',
    properties: {
      // webpack's built-in HTML head generation. Passed straight through to
      // output.html; SRI integrity is merged in by setHtml for production.
      html: {
        type: 'object',
        additionalProperties: true,
        properties: {
          integrity: { type: 'boolean' },
          csp: {},
          manifest: {},
          inline: {},
          title: { type: 'string' },
          meta: { type: 'object' },
          base: {},
          favicon: {},
        },
      },
    },
  },
};
