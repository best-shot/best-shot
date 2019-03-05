const CleanWebpackPlugin = require('clean-webpack-plugin');

const displayName = 'clean-output';

exports.name = displayName;

exports.apply = function applyClean({ options: { serve, watch } }) {
  return chain =>
    chain.when(!serve && !watch, config =>
      config.plugin(displayName).use(CleanWebpackPlugin)
    );
};
