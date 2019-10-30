'use strict';

module.exports = {
  presets: ['babel'],
  staticPath: false,
  polyfill: 'usage',
  webpackChain(chain) {
    chain.devtool(false);
    chain.optimization.runtimeChunk(true);
  }
};
