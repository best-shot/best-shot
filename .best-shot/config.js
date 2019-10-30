'use strict';

module.exports = {
  presets: ['babel', 'style'],
  staticPath: false,
  polyfill: 'usage',
  webpackChain(chain) {
    chain.devtool(false);
    chain.optimization.runtimeChunk(true);
  }
};
