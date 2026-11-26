import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import { haveDevDependencies, haveLocalDependencies } from 'settingz';

export function applyStylesheet({ needExtract }) {
  return async (chain) => {
    chain.experiments.set('css', true);

    const rule = chain.module
      .rule('style')
      .after('esm')
      .test(extToRegexp({ extname: ['css'] }));

    rule.rule('all').oneOf('url').before('not-url').dependency('url');

    const mode = chain.get('mode');

    const parent = rule.rule('all').oneOf('not-url').dependency({ not: 'url' });

    parent.type('css/auto');

    if (!needExtract) parent.parser({ exportType: 'style' });

    const generatorOptions = {
      exportsConvention: 'camel-case-only',
      // webpack 5.106 added localIdentHashFunction; xxhash64 is faster and
      // has a lower collision rate than the old md4 default. Keep the
      // 8-character hex digest so class names look the same as before.
      localIdentHashFunction: 'xxhash64',
      localIdentHashDigest: 'hex',
      localIdentHashDigestLength: 8,
      localIdentName: {
        development: '[name]_[local]-[hash]',
        production: '[local]-[hash]',
      }[mode],
    };

    chain.module.generator.set('css/auto', generatorOptions);
    // Vue `<style module>` blocks are forced to `css/module` by preset-vue
    // (webpack's css/auto only detects `.module.` in file names, not queries).
    chain.module.generator.set('css/module', generatorOptions);

    rule
      .rule('postcss')
      .use('postcss-loader')
      .loader(fileURLToPath(import.meta.resolve('postcss-loader')))
      .options({
        postcssOptions: {
          plugins: haveLocalDependencies('tailwindcss')
            ? haveDevDependencies('@tailwindcss/postcss')
              ? [
                  '@tailwindcss/postcss',
                  'postcss-preset-evergreen/lib/tailwind.cjs',
                ]
              : ['tailwindcss', 'postcss-preset-evergreen']
            : ['postcss-preset-evergreen'],
        },
      });
  };
}
