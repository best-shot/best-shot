import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { less } }) {
  return async (chain) => {
    const context = chain.get('context');

    await applyStylesheet(chain);

    applyScssLess(less)(chain);

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        fileURLToPath(new URL('node_modules', import.meta.url)),
      ),
    );
  };
}

export const schema = {
  less: {
    type: 'object',
  },
};

export const name = 'preset-style';
