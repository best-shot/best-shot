const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

exports.name = 'resolve';

exports.apply = function applyResolve() {
  return (chain) => {
    chain.resolve.merge({
      extensions: ['.js', '.cjs', '.mjs', '.json'],
      modules: ['node_modules'],
    });

    chain.resolveLoader.modules.prepend('node_modules');

    chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
  };
};
