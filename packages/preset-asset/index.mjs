import { relative, resolve } from 'path';
import { fileURLToPath } from 'url';

export function apply() {
  return async (chain) => {
    const context = chain.get('context');

    const { applyFont } = await import('./lib/apply-font.mjs');
    const { applyImage } = await import('./lib/apply-image.mjs');
    const { applyData } = await import('./lib/apply-data.mjs');

    await applyImage(chain);
    await applyFont(chain);
    await applyData(chain);

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );
  };
}

export const name = 'preset-asset';
