function mergeEnvPolyfill(item, polyfill) {
  return Array.isArray(item) && item[0] === '@babel/env'
    ? ['@babel/env', { ...item[1], useBuiltIns: polyfill }]
    : item;
}

module.exports = function addPolyfill(chain, { polyfill = 'entry' }) {
  return chain.module
    .rule('babel')
    .use('babel-loader')
    .tap(({ presets = [], ...options }) => ({
      ...options,
      presets: presets.map(opts => mergeEnvPolyfill(opts, polyfill))
    }));
};
