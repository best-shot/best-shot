'use strict';

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const displayName = 'clean';

exports.name = displayName;

exports.apply = function applyClean({ options: { serve, watch } }) {
  return chain => {
    if (!(serve || watch)) {
      chain.plugin(displayName).use(CleanWebpackPlugin);
    }
  };
};
