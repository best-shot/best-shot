import slashToRegexp from 'slash-to-regexp';
import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { css: { extract } = {} } }) {
  return async (chain) => {
    const hot = chain.devServer.get('hot');

    const needExtract = extract ? true : !hot;

    const { default: MiniCssExtractPlugin } =
      await import('mini-css-extract-plugin');

    await applyStylesheet({ needExtract, MiniCssExtractPlugin })(chain);

    applyScssLess()(chain);

    if (needExtract) {
      chain.plugin('extract-css').use(MiniCssExtractPlugin, [
        {
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

    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      const { default: CssMinimizerPlugin } =
        await import('css-minimizer-webpack-plugin');
      chain.optimization.minimizer('css-minimizer').use(CssMinimizerPlugin, [
        {
          minimizerOptions: {
            preset: ['default', { discardComments: { removeAll: true } }],
          },
        },
      ]);
    }
  };
}

export const name = 'preset-style';

export const schema = {
  css: {
    type: 'object',
    default: {},
    properties: {
      extract: {
        type: 'boolean',
        default: false,
      },
    },
  },
};
