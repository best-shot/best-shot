'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

exports.name = 'resolve';

exports.apply = function applyResolve() {
  return chain => {
    chain.resolve.merge({
      symlinks: false,
      extensions: ['.js', '.mjs', '.json'],
      modules: ['node_modules'],
      mainFields: ['browser', 'module', 'main']
    });

    chain.resolveLoader.modules.prepend('node_modules');

    chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
  };
};
