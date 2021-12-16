import { isReachable } from 'settingz';

export function apply({ config: { babel: { polyfill = false } = {} } }) {
  return async (chain) => {
    const mode = chain.get('mode') || 'development';
    const useHot = chain.devServer.get('hot') || false;

    const fileRegexp = chain.module.rule('babel').get('test');

    chain.module
      .rule('babel')
      .test(fileRegexp.add('jsx', 'tsx'))
      .use('babel-loader')
      .tap(({ presets = [], plugins = [], ...options }) => ({
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
          ...(mode === 'production'
            ? [
                ...(polyfill !== 'pure'
                  ? ['@babel/transform-react-inline-elements']
                  : []),
                isReachable('airbnb-prop-types/package.json')
                  ? [
                      'transform-react-remove-prop-types',
                      { additionalLibraries: ['airbnb-prop-types'] },
                    ]
                  : 'transform-react-remove-prop-types',
              ]
            : []),
          ...(useHot ? ['react-refresh/babel'] : []),
        ],
      }));

    if (useHot) {
      chain.optimization.runtimeChunk('single'); // TODO

      const { default: ReactRefreshPlugin } = await import(
        '@pmmmwh/react-refresh-webpack-plugin'
      );
      chain.plugin('react-refresh').use(ReactRefreshPlugin);
    }
  };
}

export const name = 'preset-react';