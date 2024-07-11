import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({
  config: {
    dataURI = false,
    css: { extname },
  },
}) {
  return async (chain) => {
    await applyStylesheet({ dataURI, extname })(chain);

    applyScssLess({ dataURI })(chain);
  };
}

export const name = 'preset-style';

export const schema = {
  dataURI: {
    type: 'boolean',
    default: false,
  },
  css: {
    type: 'object',
    default: {},
    properties: {
      extname: {
        type: 'string',
        default: '.css',
      },
    },
  },
};
