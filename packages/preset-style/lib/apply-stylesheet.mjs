import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import { haveDevDependencies, haveLocalDependencies } from 'settingz';

const auto = (resourcePath, resourceQuery) =>
  /\.module\.\w+$/i.test(resourcePath) ||
  new URLSearchParams(resourceQuery).get('module');

export function applyStylesheet({ needExtract, MiniCssExtractPlugin }) {
  return async (chain) => {
    const rule = chain.module
      .rule('style')
      .after('esm')
      .test(extToRegexp({ extname: ['css'] }));

    const assetModuleFilename = chain.output.get('assetModuleFilename');

    const cssFilename = chain.output.get('cssFilename');

    rule
      .rule('all')
      .oneOf('url')
      .before('not-url')
      .dependency('url')
      .generator.filename(assetModuleFilename.replace('[ext]', cssFilename));

    const mode = chain.get('mode');

    const parent = rule.rule('all').oneOf('not-url').dependency({ not: 'url' });

    if (needExtract) {
      parent.use('extract-css').loader(MiniCssExtractPlugin.loader).options({
        defaultExport: true,
      });
    } else {
      parent
        .use('style-loader')
        .loader(fileURLToPath(import.meta.resolve('style-loader')));
    }

    parent
      .use('css-loader')
      .loader(fileURLToPath(import.meta.resolve('css-loader')))
      .options({
        importLoaders: 3,
        modules: {
          auto,
          exportLocalsConvention: 'camel-case-only',
          localIdentName: {
            development: '[name]_[local]-[hash]',
            production: '[local]-[hash]',
          }[mode],
        },
      });

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
