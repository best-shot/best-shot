import { configKeys } from '@into-mini/auto-entries-plugin/dist/helper/utils.mjs';
import { applyCopy } from './transform.mjs';
import { applyLoaders } from './loader.mjs';

export function apply({
  config: { copy, mini: { type, tagMatcher, preserveTap } = {} },
}) {
  return async (chain) => {
    if (chain.plugins.has('copy')) {
      applyCopy(chain, { copy });
    }

    chain.output
      .publicPath('/')
      .iife(false)
      .filename('[name].js')
      .cssFilename('[name].wxss')
      .globalObject('global')
      .strictModuleErrorHandling(false)
      .importFunctionName('require.async')
      .environment({
        document: false,
        globalThis: true,
        arrowFunction: true,
        module: true,
      });

    const Module = chain.output.get('module');

    if (Module) {
      chain.output.merge({
        module: true,
        chunkFormat: 'module',
        chunkLoading: 'import',
      });
    } else {
      chain.output.merge({
        module: false,
        chunkFormat: 'commonjs',
        chunkLoading: 'require',
      });
    }

    const mode = chain.get('mode') || 'development';

    if (mode === 'development') {
      chain.devtool('source-map');
    }

    chain.resolve.mainFields.merge(['mini', 'browser', 'module', 'main']);

    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      chain.optimization.minimizer('terser').tap(([options]) => [
        {
          exclude: /miniprogram_npm/,
          ...options,
          terserOptions: {
            ...options.terserOptions,
            compress: {
              ...options.terserOptions?.compress,
              drop_console: false,
            },
            module: Module,
          },
        },
      ]);
    }

    chain.experiments.layers(true);

    applyLoaders(chain, { tagMatcher, preserveTap });

    const { SfcSplitPlugin } = await import('@into-mini/sfc-split-plugin');

    const { AutoEntriesPlugin } =
      await import('@into-mini/auto-entries-plugin');

    chain.plugin('sfc-split').use(SfcSplitPlugin, [{ type }]);

    chain.plugin('auto-entries').use(AutoEntriesPlugin, [{ type }]);

    const configs = Object.values(configKeys);

    chain.module.rule('yaml').issuerLayer({ not: configs });
    chain.module.rule('json').issuerLayer({ not: configs });

    chain.optimization.avoidEntryIife(true);

    if (chain.optimization.splitChunks.get('cacheGroups')) {
      const presets = ['vendor', 'common', 'shim', 'vue-mini', 'vue', 'react'];

      chain.optimization.splitChunks.cacheGroups(
        Object.fromEntries(
          Object.entries(chain.optimization.splitChunks.get('cacheGroups')).map(
            ([key, value]) => [
              key,
              {
                ...value,
                name: presets.includes(value.name)
                  ? ['share', value.name].join('/')
                  : value.name,
              },
            ],
          ),
        ),
      );
    }
  };
}

export const name = 'preset-mini';

export const schema = {
  mini: {
    type: 'object',
    default: {},
    properties: {
      type: {
        enum: ['miniprogram', 'plugin'],
      },
      tagMatcher: {
        instanceof: 'Function',
      },
      preserveTap: {
        instanceof: 'Function',
      },
    },
  },
  target: {
    default: 'es2015',
  },
  context: {
    default: 'src',
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
    },
  },
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
  babel: {
    type: 'object',
    properties: {
      polyfill: {
        default: {
          usage: 'pure',
          mini: true,
        },
      },
    },
  },
  vendors: {
    type: 'object',
    properties: {
      'vue-mini': {
        default: ['vue-(.)*', '@vue', '@vue-mini', '@best-shot'],
      },
    },
  },
  resolve: {
    type: 'object',
    default: {},
    properties: {
      alias: {
        type: 'object',
        default: {},
        properties: {
          vue: {
            default: '@into-mini/vue-mini-patch/alias/core.js',
          },
          'vue-router': {
            default: '@into-mini/vue-mini-patch/alias/router/index.js',
          },
          pinia: {
            default: '@into-mini/vue-mini-patch/alias/pinia.js',
          },
        },
      },
    },
  },
};
