// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { register } from 'node:module';

register('./hooks.mjs', import.meta.url);
