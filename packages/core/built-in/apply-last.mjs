export function apply({ config: { noCache } }) {
  return async (chain) => {
    if (noCache) {
      const rule = chain.module.rule('no-cache');

      rule.use('no-cache').loader('@best-shot/no-cache-loader');

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
