import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function apply() {
  return async (chain) => {
    const context = chain.get('context');

    const { applyFont } = await import('./lib/apply-font.mjs');
    const { applyImage } = await import('./lib/apply-image.mjs');

    await applyImage(chain);
    await applyFont(chain);

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );
  };
}

export const name = 'preset-asset';
