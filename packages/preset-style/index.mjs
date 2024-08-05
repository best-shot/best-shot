import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { css: { extract } = {} } }) {
  return async (chain) => {
    await applyStylesheet({ extract })(chain);

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
  output: {
    type: 'object',
    default: {},
    properties: {
      cssFilename: {
        default: '.css',
      },
    },
  },
};
