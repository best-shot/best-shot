const BestShot = require('@best-shot/core');

const { commandMode } = require('./utils');

module.exports = function createConfig(
  config,
  { command, batch, watch = false },
) {
  const { name, chain, presets = [], ...rest } = config;

  return new BestShot({ name, presets })
    .setup({
      watch,
      mode: commandMode(command),
      config: rest,
    })
    .when(typeof chain === 'function', chain)
    .when(batch, batch)
    .toConfig();
};