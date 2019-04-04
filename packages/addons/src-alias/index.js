// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

module.exports = function srcAlias({
  include = currentPath.resolve('src')
} = {}) {
  return chain => {
    chain.module
      .rule('src-alias')
      .set('resolve', {
        alias: {
          ...chain.resolve.alias.entries(),
          '@': currentPath.resolve('src')
        }
      })
      .include.when(
        Array.isArray(include),
        conf => conf.merge(include),
        conf => conf.add(include)
      );
  };
};
