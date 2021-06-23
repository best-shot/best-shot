'use strict';

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

exports.name = 'preset-react';

function airbnb() {
  try {
    return Boolean(require.resolve('airbnb-prop-types/package.json'));
  } catch {
    return false;
  }
}

exports.apply = function applyReact({ config: { polyfill = false } }) {
  return (chain) => {
    const mode = chain.get('mode') || 'development';
    const useHot = chain.devServer.get('hot') || false;

    const fileRegexp = chain.module.rule('babel').get('test');

    chain.resolve.extensions.prepend('.jsx');

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
                airbnb()
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
      chain.optimization.runtimeChunk('single');
      chain.plugin('react-refresh').use(ReactRefreshWebpackPlugin);
    }
  };
};
