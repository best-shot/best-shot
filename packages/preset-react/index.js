'use strict';

exports.name = 'preset-react';

exports.apply = function applyReact({ mode, options: { serve } }) {
  return chain => {
    const useHot = serve && chain.devServer.get('hot');

    const additionPlugins =
      mode === 'production' ? ['transform-react-remove-prop-types'] : [];

    chain.resolve.extensions.prepend('.jsx');

    if (useHot) {
      chain.resolve.alias.set('react-dom', '@hot-loader/react-dom');
    }

    const fileRegexp = chain.module.rule('babel').get('test');

    chain.module
      .rule('babel')
      .test(fileRegexp.add('jsx'))
      .use('babel-loader')
      .tap(({ presets = [], plugins = [], ...options }) => ({
        ...options,
        presets: [...presets, '@babel/react'],
        plugins: [...plugins, 'react-hot-loader/babel', ...additionPlugins]
      }));
  };
};
