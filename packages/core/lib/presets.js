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

function getIndex(item) {
  const index = allowPresets.indexOf(item);
  return index !== -1 ? -1 : index;
}

function sortPresets([...data]) {
  data.sort((a, b) =>
    allowPresets.includes(a) ? getIndex(a) - getIndex(b) : data.indexOf(a),
  );
  return data;
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
      // eslint-disable-next-line global-require, import/no-dynamic-require
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
