import { mergeOptions } from './helper.js';

export function $$asComponent(options) {
  const io = mergeOptions(options);
  /* global Component: readonly */
  Component(io);
}
