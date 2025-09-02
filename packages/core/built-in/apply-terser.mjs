import { deepmerge as deepMerge } from 'deepmerge-ts';
import os from 'node:os';

import { targetIsNode } from '../lib/utils.mjs';

const displayName = 'terser';

export function apply({
  cwd,
  config: { output: { module: useModule = false } = {}, terser = {} },
}) {
  return async (chain) => {
    const { default: browserslist } = await import('browserslist');

    function haveSafari10(path) {
      const config = browserslist.loadConfig({ path });

      const list = config && config.length > 0 ? config : browserslist.defaults;

      return browserslist([
        ...list,
        'not ios_saf > 11',
        'not safari > 11',
        'not ios_saf < 10',
        'not safari < 10',
      ]).some((item) => item.includes('saf'));
    }

    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      const target = chain.get('target');

      const { default: TerserPlugin } = await import('terser-webpack-plugin');

      const notNode = !targetIsNode(target);

      chain.optimization.minimizer('terser').use(TerserPlugin, [
        {
          extractComments: false,
          parallel: os.cpus().length - 1,
          terserOptions: deepMerge(
            {
              safari10: notNode && haveSafari10(cwd),
              compress: {
                drop_console: notNode,
                passes: 2,
              },
              format: {
                comments: false,
                ascii_only: true,
              },
            },
            terser,
            { module: useModule },
          ),
        },
      ]);
    }
  };
}

export const name = displayName;

export const schema = {
  terser: {
    title: 'terserOptions',
    type: 'object',
  },
};
