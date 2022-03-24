const allowPresets = ['babel', 'style', 'asset', 'react', 'vue', 'web'];

function sortPresets(data) {
  const io = [...new Set(data)];
  io.sort((next, prev) => {
    const P = allowPresets.indexOf(prev);
    const N = allowPresets.indexOf(next);

    return P === -1 && N === -1
      ? 0
      : P === -1
      ? -1
      : N === -1
      ? 1
      : N < P
      ? -1
      : 1;
  });

  return io;
}

function checkPresets(presets) {
  if (presets.includes('vue') && presets.includes('react')) {
    throw new Error("Don't use React and Vue at the same time");
  }
}

export function importPresets(presets) {
  checkPresets(presets);

  try {
    const sorted = sortPresets(presets);

    return sorted.map(
      (preset) => () =>
        import(
          /* webpackIgnore: true */
          `@best-shot/preset-${preset}`
        ),
    );
  } catch (error) {
    console.error(error);
    throw new Error('Import presets fail.');
  }
}
