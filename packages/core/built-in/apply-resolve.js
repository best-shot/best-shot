exports.name = 'resolve';

exports.apply = function applyResolve({ options: { serve } }) {
  return chain => {
    chain
      .batch(config =>
        config.resolve.merge({
          symlinks: false,
          extensions: ['.mjs', '.js', '.json'],
          modules: ['node_modules'],
          mainFields: serve
            ? ['browser', 'main', 'module']
            : ['module', 'browser', 'main']
        })
      )
      .batch(config =>
        config.resolveLoader.merge({
          modules: ['node_modules']
        })
      );
  };
};
