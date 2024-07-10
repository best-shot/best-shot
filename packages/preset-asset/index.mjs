export function apply() {
  return async (chain) => {
    const { applyFont } = await import('./lib/apply-font.mjs');
    const { applyImage } = await import('./lib/apply-image.mjs');

    await applyImage(chain);
    await applyFont(chain);
  };
}

export const name = 'preset-asset';
