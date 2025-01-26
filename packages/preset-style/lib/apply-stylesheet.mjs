import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import { haveDevDependencies, haveLocalDependencies } from 'settingz';
import slashToRegexp from 'slash-to-regexp';

const auto = (resourcePath, resourceQuery) =>
  /\.module\.\w+$/i.test(resourcePath) ||
  new URLSearchParams(resourceQuery).get('module');

export function applyStylesheet({ extract }) {
  return async (chain) => {
    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      const { default: CssMinimizerPlugin } = await import(
        'css-minimizer-webpack-plugin'
      );
      chain.optimization.minimizer('css-minimizer').use(CssMinimizerPlugin, [
        {
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        },
      ]);
    }

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

    const { default: MiniCssExtractPlugin } = await import(
      'mini-css-extract-plugin'
    );

    const mode = chain.get('mode');
    const hot = chain.devServer.get('hot');

    const needExtract = extract ? true : !hot;

    if (needExtract) {
      chain.plugin('extract-css').use(MiniCssExtractPlugin, [
        {
          filename: `[name]${cssFilename}`,
          // chunkFilename: '[id].css',
          ignoreOrder: true,
          experimentalUseImportModule: true,
        },
      ]);
    }

    if (chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'));

      if (needExtract) {
        chain.module
          .rule('babel')
          .exclude.add(slashToRegexp('/node_modules/mini-css-extract-plugin/'));
      }
    }

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
            ? [
                haveDevDependencies('@tailwindcss/postcss')
                  ? '@tailwindcss/postcss'
                  : 'tailwindcss',
                'postcss-preset-evergreen/lib/tailwind.cjs',
              ]
            : ['postcss-preset-evergreen'],
        },
      });
  };
}
