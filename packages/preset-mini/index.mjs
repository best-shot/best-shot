import { fileURLToPath } from 'node:url';

import { getAllPages, readYAML } from './helper.mjs';

export function apply() {
  return (chain) => {
    chain.module
      .rule('vue')
      .test(/\.vue$/)
      .use('loader')
      .loader(
        fileURLToPath(import.meta.resolve('@best-shot/sfc-split-loader')),
      );

    const context = chain.get('context');

    const io = readYAML('app.yaml', context);
    const allPages = getAllPages(io);

    chain
      .entry('app')
      .add('./app.js')
      .add('./app.css')
      .add('./app.yaml?to-url');

    for (const page of allPages) {
      chain.entry(page).add(`./${page}.vue`);
    }
  };
}

export const name = 'preset-mini';

export const schema = {
  target: {
    default: 'es2024',
  },
  context: {
    default: 'src',
  },
  output: {
    type: 'object',
    properties: {
      publicPath: {
        default: '/',
      },
      module: {
        default: true,
      },
      chunkFormat: {
        default: 'commonjs',
      },
      chunkLoading: {
        default: 'require',
      },
    },
  },
  dataURI: {
    default: true,
  },
  optimization: {
    type: 'object',
    properties: {
      splitChunks: {
        default: true,
      },
    },
  },
};
