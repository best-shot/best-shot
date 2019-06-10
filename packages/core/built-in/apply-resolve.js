'use strict';

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
  };
};
