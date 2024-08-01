import { fileURLToPath } from 'node:url';

import { getAllPages, readYAML } from './helper.mjs';

export function apply({ config: { appConfig } }) {
  return (chain) => {
    chain.output.merge({
      publicPath: '/',
      iife: false,
      asyncChunks: false,
      module: false,
      chunkFormat: 'commonjs',
      chunkLoading: 'require',
    });

    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      chain.optimization
        .minimizer('terser')
        .tap(([options]) => [{ exclude: /miniprogram_npm/, ...options }]);
    }

    chain.module
      .rule('wxml')
      .test(/\.wxml$/)
      .type('asset/resource')
      .use('prettier-loader')
      .loader(
        fileURLToPath(
          import.meta.resolve(
            '@best-shot/sfc-split-plugin/prettier-loader.cjs',
          ),
        ),
      )
      .options({
        parser: 'html',
      });

    chain.plugin('sfc-split').use('@best-shot/sfc-split-plugin/webpack.cjs');

    const context = chain.get('context');

    if (appConfig) {
      const io = readYAML('app.yaml', context);
      const allPages = getAllPages(io);

      for (const page of allPages) {
        chain.entry(page).add(`./${page}.vue`);
      }
    }
  };
}

export const name = 'preset-mini';

export const schema = {
  appConfig: {
    default: false,
  },
  target: {
    default: ['es2024', 'web'],
  },
  context: {
    default: 'src',
  },
  optimization: {
    type: 'object',
    properties: {
      runtimeChunk: {
        default: 'single',
      },
      splitChunks: {
        default: true,
      },
    },
  },
  css: {
    type: 'object',
    properties: {
      extname: {
        default: '.wxss',
      },
    },
  },
  output: {
    type: 'object',
    default: {},
    properties: {
      clean: {
        default: {
          keep: 'miniprogram_npm',
        },
      },
      publicPath: {
        default: '/',
      },
    },
  },
  babel: {
    properties: {
      polyfill: {
        default: 'pure',
      },
      env: {
        default: 'always',
      },
    },
  },
};
