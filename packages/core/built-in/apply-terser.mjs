import { deepmerge as deepMerge } from 'deepmerge-ts';

import { targetIsNode } from '../lib/utils.mjs';

const displayName = 'terser';

export function apply({
  cwd,
  config: {
    output: { module: useModule = false } = {},
    terser = {},
    mini,
  },
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

      const notNode = !targetIsNode(target);

      const terserOptions = deepMerge(
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
      );

      // webpack 5.113's built-in minimizer already uses TerserPlugin's
      // `terserMinify` for JS, so no manual minimizer is needed by default.
      // Feed terser-compatible options through `minimizeOptions.javascript`
      // and let the built-in pool handle JS together with CSS/HTML/JSON.
      let javascript = terserOptions;

      if (mini !== undefined) {
        // Mini builds need to exclude `miniprogram_npm`, which the built-in
        // minimizer cannot express. Register a terser plugin so preset-mini can
        // tap it with that exclude, and disable the built-in JS minimizer to
        // avoid minifying code twice.
        const { default: TerserPlugin } = await import('terser-webpack-plugin');

        javascript = false;
        chain.optimization.minimizer('terser').use(TerserPlugin, [
          { terserOptions },
        ]);
      }

      chain.optimization.set('minimizeOptions', {
        ...chain.optimization.get('minimizeOptions'),
        javascript,
      });
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
