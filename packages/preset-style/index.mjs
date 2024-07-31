import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { css: { extname, extract } = {} } }) {
  return async (chain) => {
    await applyStylesheet({ extname, extract })(chain);

    applyScssLess()(chain);
  };
}

export const name = 'preset-style';

export const schema = {
  css: {
    type: 'object',
    default: {},
    properties: {
      extname: {
        type: 'string',
        default: '.css',
      },
      extract: {
        type: 'boolean',
        default: false,
      },
    },
  },
};
