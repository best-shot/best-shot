exports.name = 'entry';

exports.apply = function applyEntry({ config: { entry } }) {
  return config =>
    config.merge({
      entry:
        typeof entry === 'string' || Array.isArray(entry)
          ? { main: entry }
          : entry
    });
};

const oneOfSchema = [
  { minLength: 1, type: 'string' },
  {
    type: 'array',
    minItems: 1,
    uniqueItems: true,
    items: { minLength: 1, type: 'string' }
  }
];

exports.schema = {
  entry: {
    default: '.\\src\\index.js',
    oneOf: [
      ...oneOfSchema,
      {
        type: 'object',
        minProperties: 1,
        additionalProperties: {
          oneOf: oneOfSchema
        }
      }
    ]
  }
};
