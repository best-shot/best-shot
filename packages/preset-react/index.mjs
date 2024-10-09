import { haveLocalDependencies } from 'settingz';

export const name = 'preset-react';

export function apply() {
  return async (chain) => {
    const mode = chain.get('mode') || 'development';
    const useHot = chain.devServer.get('hot') || false;

    chain.resolve.extensions.prepend('.tsx');

    const fileRegexp = chain.module.rule('babel').get('test');

    chain.module
      .rule('babel')
      .test(fileRegexp.add('jsx', 'tsx'))
      .use('babel-loader')
      .tap(({ presets = [], plugins = [], ...options } = {}) => ({
        ...options,
        presets: [
          ...presets,
          [
            '@babel/react',
            {
              useSpread: true,
              runtime: 'automatic',
              ...(mode === 'development' ? { development: true } : undefined),
            },
          ],
        ],
        plugins: [
          ...plugins,
          '@babel/transform-react-constant-elements',
          '@babel/transform-react-inline-elements',
          mode === 'production' && haveLocalDependencies('airbnb-prop-types')
            ? [
                'transform-react-remove-prop-types',
                { additionalLibraries: ['airbnb-prop-types'] },
              ]
            : 'transform-react-remove-prop-types',
          ...(useHot ? ['react-refresh/babel'] : []),
        ].filter(Boolean),
      }));

    if (useHot) {
      chain.optimization.runtimeChunk('single');

      const { default: ReactRefreshPlugin } = await import(
        '@pmmmwh/react-refresh-webpack-plugin'
      );
      chain.plugin('react-refresh').use(ReactRefreshPlugin);
    }
  };
}

export const schema = {
  vendors: {
    type: 'object',
    properties: {
      react: {
        default: [
          'prop-types',
          'react',
          'react-(.)*',
          'scheduler',
          '@remix-run',
          'history',
        ],
      },
    },
  },
};
