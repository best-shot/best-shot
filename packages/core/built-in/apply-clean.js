'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const displayName = 'clean';

exports.name = displayName;

exports.apply = function applyClean() {
  return chain => {
    const watch = chain.get('watch');

    if (!watch) {
      chain.plugin(displayName).use(CleanWebpackPlugin);
    }
  };
};
