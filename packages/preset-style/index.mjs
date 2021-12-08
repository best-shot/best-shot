import { relative, resolve } from 'path';
import { fileURLToPath } from 'url';

import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { less, asset: { esModule = true } = {} } }) {
  return async (chain) => {
    const context = chain.get('context');

    await applyStylesheet(chain, esModule);

    applyScssLess(less)(chain);

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );
  };
}

export const schema = {
  less: {
    type: 'object',
  },
  asset: {
    type: 'object',
    default: {},
    properties: {
      esModule: {
        type: 'boolean',
        default: true,
      },
    },
  },
};

export const name = 'preset-style';
