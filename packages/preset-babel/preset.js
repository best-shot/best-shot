const { declare } = require('@babel/helper-plugin-utils');

module.exports = declare((api, options) => {
  api.assertVersion(7);

  const { polyfill, targets = { browsers: 'defaults' } } = options;

  const plugins = [
    ['@babel/proposal-decorators', { decoratorsBeforeExport: true }],
    '@babel/proposal-class-properties'
  ];

  if (polyfill === 'pure') {
    plugins.push([
      '@babel/transform-runtime',
      // @ts-ignore
      { corejs: 3, useESModules: true }
    ]);
  }

  return {
    presets: [
      [
        '@babel/env',
        {
          modules: false,
          useBuiltIns: polyfill === 'pure' ? false : polyfill,
          ...(polyfill === 'usage' ? { corejs: 3 } : undefined),
          spec: true,
          targets
        }
      ]
    ],
    plugins
  };
});
