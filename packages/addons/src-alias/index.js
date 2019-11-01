'use strict';

const { resolve } = require('@best-shot/core/lib/path');

module.exports = function srcAlias({ include = resolve('src') } = {}) {
  return chain => {
    const context = chain.get('context');

    chain.module
      .rule('src-alias')
      .set('resolve', {
        alias: {
          ...chain.resolve.alias.entries(),
          '@': resolve(context, 'src')
        }
      })
      .include.when(
        Array.isArray(include),
        conf => conf.merge(include),
        conf => conf.add(include)
      );
  };
};
