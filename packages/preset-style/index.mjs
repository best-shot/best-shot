import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { applyScssLess } from './lib/apply-scss-less.mjs';
import { applyStylesheet } from './lib/apply-stylesheet.mjs';

export function apply({ config: { dataURI = false } }) {
  return async (chain) => {
    const context = chain.get('context');

    await applyStylesheet({ dataURI })(chain);

    applyScssLess({ dataURI })(chain);

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        fileURLToPath(new URL('node_modules', import.meta.url)),
      ),
    );
  };
}

export const name = 'preset-style';

export const schema = {
  dataURI: {
    type: 'boolean',
    default: false,
  },
};
