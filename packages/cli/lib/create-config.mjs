import BestShot from '@best-shot/core';

import { commandMode } from './utils.mjs';

export function createConfig(config, { command, batch, watch = false }) {
  const { name, chain, presets = [], ...rest } = config;

  return new BestShot({
    name,
    presets:
      command === 'serve'
        ? presets
        : presets.filter((item) => item !== 'serve'),
  })
    .setup({
      watch,
      mode: commandMode(command),
      config: rest,
    })
    .when(typeof chain === 'function', chain)
    .when(batch, batch)
    .delete('watch')
    .toConfig();
}
