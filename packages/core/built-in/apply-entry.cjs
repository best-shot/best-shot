'use strict';

exports.name = 'entry';

exports.apply = function applyEntry({ config: { entry } }) {
  return (config) => {
    if (entry) {
      config.merge({
        entry:
          typeof entry === 'string' || Array.isArray(entry)
            ? { main: entry }
            : entry,
      });
    }
  };
};

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

exports.schema = {
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
};
