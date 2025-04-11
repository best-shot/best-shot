export function apply({
  config: { mini: { type } = {}, output: { module: Module } = {} },
}) {
  return async (chain) => {
    chain.output
      .publicPath('/')
      .iife(false)
      .asyncChunks(false)
      .filename('[name].js')
      .globalObject('globalThis')
      .environment({
        document: false,
        dynamicImport: false,
        globalThis: true,
        arrowFunction: true,
        module: true,
      });

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
          },
        },
      ]);
    }

    chain.module
      .rule('style')
      .rule('all')
      .oneOf('not-url')
      .use('css-loader')
      .tap((options) => ({
        ...options,
        import: false,
        modules: false,
      }));

    chain.experiments.layers(true);

    const rule = chain.module.rule('babel');

    rule.test(rule.get('test').add('vue'));

    const { AllInOnePlugin } = await import('@best-shot/sfc-split-plugin');

    chain.plugin('sfc-split').use(AllInOnePlugin, [
      {
        type,
      },
    ]);

    const presets = ['vendor', 'common', 'shim', 'vue-mini', 'vue', 'react'];

    chain.optimization.avoidEntryIife(true);

    if (chain.optimization.splitChunks.get('cacheGroups')) {
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
      cssFilename: {
        default: '.wxss',
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
};
