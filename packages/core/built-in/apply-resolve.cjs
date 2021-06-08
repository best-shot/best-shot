exports.name = 'resolve';

const { notEmpty } = require('../lib/utils.cjs');

exports.apply = function applyResolve({ config: { alias } }) {
  return (chain) => {
    chain.resolve.merge({
      extensions: ['.js', '.cjs', '.mjs', '.json'],
      modules: ['node_modules'],
    });

    if (notEmpty(alias)) {
      chain.resolve.alias.merge(alias);
    }

    chain.resolveLoader.modules.prepend('node_modules');

    const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
    chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
  };
};

exports.schema = {
  alias: {
    type: 'object',
  },
};
