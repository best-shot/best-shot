import browserslist from 'browserslist';
import deepMerge from 'deepmerge';

const displayName = 'tersor';

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

const overwriteMerge = (destinationArray, sourceArray) => sourceArray;

function isNode(target) {
  return (
    target &&
    (target.includes('node') ||
      target.includes('nwjs') ||
      target.includes('electron'))
  );
}

function targetIsNode(target = []) {
  return Array.isArray(target) ? target.some((t) => isNode(t)) : isNode(target);
}

export function apply({ config: { terser = {} } }) {
  return async (chain) => {
    const minimize = chain.optimization.get('minimize');

    if (minimize) {
      const context = chain.get('context');
      const target = chain.get('target');

      const { default: TerserPlugin } = await import('terser-webpack-plugin');

      const notNode = targetIsNode(target);

      chain.optimization.minimizer('terser').use(TerserPlugin, [
        {
          extractComments: false,
          terserOptions: deepMerge(
            {
              safari10: notNode && haveSafari10(context),
              compress: {
                drop_console: notNode,
              },
              output: {
                comments: false,
                ascii_only: true,
              },
            },
            terser,
            { arrayMerge: overwriteMerge },
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
