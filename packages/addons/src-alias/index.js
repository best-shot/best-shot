// eslint-disable-next-line import/no-extraneous-dependencies
const { currentPath } = require('@best-shot/core/lib/common');

module.exports = function srcAlias({ include = currentPath('./src') } = {}) {
  return chain =>
    chain.module
      .rule('src-alias')
      .include.when(
        Array.isArray(include),
        conf => conf.merge(include),
        conf => conf.add(include)
      )
      .end()
      .set('resolve', {
        alias: {
          ...chain.resolve.alias.entries(),
          '@': currentPath('./src')
        }
      });
};
