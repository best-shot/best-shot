'use strict';

const { cachePath } = require('./utils.cjs');

module.exports = function BaseChain(name, rootPath) {
  const WebpackChain = require('webpack-chain');

  class Chain extends WebpackChain {
    toConfig() {
      super.delete('x');
      return super.toConfig();
    }

    toString() {
      super.delete('x');
      return super.toString();
    }
  }

  const chain = new Chain().name(name).context(rootPath);

  chain.set('x', {
    cachePath: (...args) => {
      const configName = chain.get('name') || 'default';
      return cachePath(configName, ...args);
    },
  });

  return chain;
};
