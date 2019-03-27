const allowPresets = [
  'serve',
  'babel',
  'style',
  'react',
  'vue',
  'web',
  'megalo',
  'airkro',
  'env'
];

function sortPresets([...data]) {
  data.sort((a, b) => allowPresets.indexOf(a) - allowPresets.indexOf(b));
  return data;
}

function checkPresets(presets) {
  if (!presets.every(item => allowPresets.includes(item))) {
    const message = `[${allowPresets.join(',')}]`;
    throw Error(`Presets only allow ${message}`);
  }
  if (presets.includes('vue') && presets.includes('react')) {
    throw Error("Don't use React and Vue at the same time");
  }
}

function importPresets(presets) {
  checkPresets(presets);
  try {
    const sorted = sortPresets(presets);
    const io = sorted
      .map(preset => `@best-shot/preset-${preset}`)
      // eslint-disable-next-line global-require, import/no-dynamic-require
      .map(name => require(name));
    return io;
  } catch (err) {
    console.error(err);
    throw Error('Import presets fail.');
  }
}

module.exports = {
  allowPresets,
  checkPresets,
  sortPresets,
  importPresets
};
