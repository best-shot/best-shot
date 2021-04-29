exports.name = 'resolve';

exports.apply = function applyResolve() {
  return (chain) => {
    chain.resolve.merge({
      extensions: ['.js', '.cjs', '.mjs', '.json'],
      modules: ['node_modules'],
    });

    chain.resolveLoader.modules.prepend('node_modules');

    const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
    chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
  };
};
