export function apply({
  config: { mini: { type } = {}, output: { module: Module } = {} },
}) {
  return (chain) => {
    chain.output.publicPath('/').iife(false).asyncChunks(false);

    if (Module) {
      chain.output.merge({
        module: true,
        chunkFormat: 'module',
        chunkLoading: 'import',
        library: {
          type: 'module',
        },
      });
    } else {
      chain.output.merge({
        module: false,
        chunkFormat: 'commonjs',
        chunkLoading: 'require',
        library: {
          type: 'commonjs2',
        },
      });
    }

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

    chain.experiments.set('layers', true);

    const rule = chain.module.rule('babel');

    rule.test(rule.get('test').add('vue'));

    chain.plugin('sfc-split').use('@best-shot/sfc-split-plugin', [
      {
        type,
      },
    ]);
  };
}

export const name = 'preset-mini';

export const schema = {
  mini: {
    type: 'object',
    default: {},
    properties: {
      type: {
        enum: ['app', 'plugin'],
      },
    },
  },
  target: {
    default: 'browserslist',
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
      publicPath: {
        default: '/',
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
};
