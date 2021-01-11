function isRaw(url) {
  const [last] = url.split('/').slice(-1);
  return last && !/\.html?$/.test(last) && /\.\w+$/.test(last);
}

function autoAddPreset(configs) {
  if (configs.length === 1) {
    // eslint-disable-next-line no-param-reassign
    configs[0].presets = ['serve', ...(configs[0].presets || [])];
  }
}

module.exports = {
  isRaw,
  autoAddPreset,
};
