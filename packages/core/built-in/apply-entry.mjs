export function apply({ config: { entry } }) {
  return (chain) => {
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

export const name = 'entry';

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

export const schema = {
  entry: {
    oneOf: [
      ...oneOf,
      {
        type: 'object',
        minProperties: 1,
        additionalProperties: {
          oneOf: [
            {
              type: 'object',
            },
            ...oneOf,
          ],
        },
      },
    ],
  },
};
