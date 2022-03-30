import { validate as coreValidate } from '@best-shot/validator';

export function hasUniqueNames(config) {
  return (
    Array.isArray(config) &&
    new Set(config.map(({ name }) => name)).size !== config.length
  );
}

const obj = {
  type: 'object',
  properties: {
    presets: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
      },
    },
  },
};

const schema = {
  oneOf: [
    obj,
    {
      type: 'array',
      items: obj,
      maxItems: 8,
      minItems: 1,
    },
  ],
};

export async function validate(config) {
  await coreValidate({ schema, data: config });
}
