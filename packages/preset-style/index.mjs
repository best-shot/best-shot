import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { dataURI = false } }) {
  return async (chain) => {
    await applyStylesheet({ dataURI })(chain);

    applyScssLess({ dataURI })(chain);
  };
}

export const name = 'preset-style';

export const schema = {
  dataURI: {
    type: 'boolean',
    default: false,
  },
};
