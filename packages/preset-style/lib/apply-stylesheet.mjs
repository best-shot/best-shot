import { fileURLToPath } from 'node:url';

import extToRegexp from 'ext-to-regexp';
import { haveLocalDependencies } from 'settingz';
import slashToRegexp from 'slash-to-regexp';

const auto = (resourcePath, resourceQuery) =>
  /\.module\.\w+$/i.test(resourcePath) ||
  new URLSearchParams(resourceQuery).get('module');

function batchPostCSS(rule) {
  rule
    .use('postcss-loader')
    .loader(fileURLToPath(import.meta.resolve('postcss-loader')))
    .options({
      postcssOptions: {
        plugins: [
          haveLocalDependencies('tailwindcss') ? 'tailwindcss' : undefined,
          'postcss-preset-evergreen',
        ].filter(Boolean),
      },
    });
}

function batch(
  rule,
  { hot, mode, MiniCssExtractPlugin, assetModuleFilename, extname },
) {
  if (assetModuleFilename) {
    rule
      .rule('all')
      .oneOf('url')
      .before('not-url')
      .dependency('url')
      .generator.filename(assetModuleFilename.replace('[ext]', extname));
  }

  const parent = rule.rule('all').oneOf('not-url').dependency({ not: 'url' });

  if (hot) {
    parent
      .use('style-loader')
      .loader(fileURLToPath(import.meta.resolve('style-loader')));
  } else {
    parent.use('extract-css').loader(MiniCssExtractPlugin.loader).options({
      defaultExport: true,
    });
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
}

export function applyStylesheet({ dataURI = false, extname }) {
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

    const { default: MiniCssExtractPlugin } = await import(
      'mini-css-extract-plugin'
    );

    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const hot = chain.devServer.get('hot') || false;

    if (!hot) {
      chain.plugin('extract-css').use(MiniCssExtractPlugin, [
        {
          filename: `[name]${extname}`,
          // chunkFilename: '[id].css',
          ignoreOrder: true,
        },
      ]);
    }

    if (!watch && chain.module.rules.has('babel')) {
      chain.module
        .rule('babel')
        .exclude.add(slashToRegexp('/node_modules/css-loader/'));

      if (!hot) {
        chain.module
          .rule('babel')
          .exclude.add(slashToRegexp('/node_modules/mini-css-extract-plugin/'));
      }
    }

    const rule1 = chain.module
      .rule('style')
      .after('esm')
      .test(extToRegexp({ extname: ['css', 'scss', 'sass', 'less'] }));

    const assetModuleFilename = chain.output.get('assetModuleFilename');

    batch(rule1, {
      mode,
      hot,
      extname,
      MiniCssExtractPlugin,
      assetModuleFilename: dataURI ? false : assetModuleFilename,
    });

    rule1.rule('postcss').batch(batchPostCSS);

    if (dataURI) {
      const rule2 = chain.module
        .rule('style-uri')
        .after('style')
        .mimetype(['text/css', 'text/scss', 'text/sass', 'text/less']);

      rule2
        .type('asset/resource')
        .generator.filename((args) => args.runtime + extname)
        .end()
        .batch(batchPostCSS)
        .use('postcss-loader')
        .loader(fileURLToPath(import.meta.resolve('postcss-loader')))
        .tap((options) => ({
          ...options,
          postcssOptions: {
            config: false,
            ...options.postcssOptions,
          },
        }));
    }
  };
}
