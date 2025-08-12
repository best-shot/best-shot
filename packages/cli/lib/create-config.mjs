import { BestShot } from '@best-shot/core';

export async function createConfig(
  config,
  { mode, batch, watch = false, serve = false },
) {
  const { name, chain, presets = [], ...rest } = config;

  const io = await new BestShot({ name }).setup({
    watch,
    serve,
    mode,
    presets,
    config: rest,
  });

  return io
    .when(typeof chain === 'function', chain)
    .when(batch, batch)
    .delete('watch')
    .toConfig();
}
