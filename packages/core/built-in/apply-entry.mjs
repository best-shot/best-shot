import { targetIsNode } from '../lib/utils.mjs';

export function apply({ config: { entry, hashbang } }) {
  return async (chain) => {
    const target = chain.get('target');

    if (targetIsNode(target)) {
      const {
        default: { BannerPlugin },
      } = await import('webpack');

      chain.plugin('hashbang').use(BannerPlugin, [
        {
          ...hashbang,
          banner: '#!/usr/bin/env node',
          entryOnly: true,
          raw: true,
        },
      ]);
    }

    if (entry) {
      chain.merge({
        entry:
          typeof entry === 'string' || Array.isArray(entry)
            ? { main: entry }
            : entry,
      });
    }
  };
}

const items = {
  minLength: 1,
  type: 'string',
};

const oneOf = [
  items,
  {
    type: 'array',
    minItems: 1,
    uniqueItems: true,
    items,
  },
];

export const name = 'entry';

export const schema = {
  entry: {
    oneOf: [
      ...oneOf,
      {
        type: 'object',
        minProperties: 1,
        additionalProperties: {
          oneOf,
        },
      },
    ],
  },
  hashbang: {
    type: 'object',
    default: {
      include: ['bin.cjs', 'bin.mjs', 'cli.cjs', 'cli.mjs'],
    },
  },
};
