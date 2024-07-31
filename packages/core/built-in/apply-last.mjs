import { fileURLToPath } from 'node:url';

export function apply({ config: { noCache } }) {
  return async (chain) => {
    const cache = chain.get('cache');

    if (cache && noCache) {
      const rule = chain.module.rule('no-cache');

      rule
        .use('no-cache')
        .loader(
          fileURLToPath(import.meta.resolve('@best-shot/no-cache-loader')),
        );

      if (Array.isArray(noCache)) {
        rule.include.merge(noCache);
      } else {
        rule.include.add(noCache);
      }
    }
  };
}

export const name = 'last';

export const schema = {
  noCache: {
    oneOf: [
      {
        instanceof: 'RegExp',
      },
      {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: { instanceof: 'RegExp' },
      },
    ],
  },
};
