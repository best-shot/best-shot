exports.name = 'preset-react';

exports.apply = function applyReact({ mode, options: { serve } }) {
  return chain => {
    const useHot = serve && chain.devServer.get('hot');

    const additionPlugins = [
      mode === 'production' ? 'transform-react-remove-prop-types' : undefined
    ].filter(Boolean);

    return chain
      .batch(config => config.resolve.extensions.prepend('.jsx'))
      .when(useHot, config =>
        config.resolve.alias.set('react-dom', '@hot-loader/react-dom')
      )
      .batch(config => {
        const fileRegexp = config.module.rule('babel').get('test');
        return config.module
          .rule('babel')
          .test(fileRegexp.add('jsx'))
          .use('babel-loader')
          .tap(({ presets = [], plugins = [], ...options }) => ({
            ...options,
            presets: [...presets, '@babel/react'],
            plugins: [...plugins, 'react-hot-loader/babel', ...additionPlugins]
          }));
      });
  };
};
