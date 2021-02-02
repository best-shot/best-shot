const allowPresets = [
  'serve',
  'babel',
  'style',
  'asset',
  'react',
  'vue',
  'env',
  'web',
];

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

function importPresets(presets) {
  checkPresets(presets);
  try {
    const sorted = sortPresets(presets);
    const io = sorted
      .map((preset) => `@best-shot/preset-${preset}`)
      .map((name) => require(name));
    return io;
  } catch (error) {
    console.error(error);
    throw new Error('Import presets fail.');
  }
}

module.exports = {
  allowPresets,
  checkPresets,
  sortPresets,
  importPresets,
};
