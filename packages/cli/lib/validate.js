const coreValidate = require('@best-shot/core/lib/validate');

function hasUniqueNames(config) {
  return (
    Array.isArray(config) &&
    new Set(config.map(({ name }) => name)).size !== config.length
  );
}

const schema = {
  oneOf: [
    { type: 'object' },
    {
      type: 'array',
      items: { type: 'object' },
      maxItems: 8,
      minItems: 1,
    },
  ],
};

module.exports = function validate(config) {
  // @ts-ignore
  coreValidate({ schema, data: config });

  if (hasUniqueNames(config)) {
    throw new coreValidate.ConfigError('every config[x].name should be unique');
  }
};
