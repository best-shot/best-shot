import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config }) {
  return async (chain) => {
    const { extract } = config.css || {};

    const hot = chain.devServer.get('hot');

    const isNeedExtract = extract ? true : !hot;

    await applyStylesheet({ needExtract: isNeedExtract })(chain);

    applyScssLess()(chain);
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
