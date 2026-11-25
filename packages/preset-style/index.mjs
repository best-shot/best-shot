import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config }) {
  return async (chain) => {
    const { extract } = config.css || {};

    const hot = chain.devServer.get('hot');

    const isNeedExtract = extract ? true : !hot;

    await applyStylesheet({ needExtract: isNeedExtract })(chain);

    applyScssLess()(chain);

    if (!chain.optimization.get('minimize')) return;

    const { default: MinimizerPlugin } =
      await import('minimizer-webpack-plugin');

    chain.optimization.minimizer('css').use(MinimizerPlugin, [
      {
        test: /\.css$/i,
        minify: MinimizerPlugin.cssnanoMinify,
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      },
    ]);
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
