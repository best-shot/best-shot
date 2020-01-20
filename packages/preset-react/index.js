const slashToRegexp = require('slash-to-regexp');

exports.name = 'preset-react';

exports.apply = function applyReact() {
  return chain => {
    const isProd = chain.get('mode') === 'production';
    const useHot = chain.devServer.get('hot');

    if (useHot) {
      Object.entries(chain.entryPoints.entries()).forEach(([key]) => {
        chain.entry(key).prepend('react-hot-loader/patch');
      });
      chain.resolve.alias.set('react-dom', '@hot-loader/react-dom');
    }

    const fileRegexp = chain.module.rule('babel').get('test');

    chain.resolve.extensions.prepend('.jsx');

    chain.module
      .rule('babel')
      .exclude.add(slashToRegexp('/node_modules/react-hot-loader/'))
      .end()
      .test(fileRegexp.add('jsx'))
      .use('babel-loader')
      .tap(({ presets = [], plugins = [], ...options }) => ({
        ...options,
        presets: [...presets, ['@babel/react', { useSpread: true }]],
        plugins: [
          ...plugins,
          ...(isProd ? ['transform-react-remove-prop-types'] : []),
          ...(useHot ? ['react-hot-loader/babel'] : [])
        ]
      }));
  };
};
