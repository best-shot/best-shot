exports.name = 'resolve';

exports.apply = function applyResolve() {
  return chain => {
    chain.resolve.merge({
      symlinks: false,
      extensions: ['.mjs', '.js', '.json'],
      modules: ['node_modules'],
      mainFields: ['module', 'browser', 'main']
    });

    chain.resolveLoader.modules.prepend('node_modules');
  };
};
