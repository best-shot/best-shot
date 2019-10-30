'use strict';

const Ajv = require('ajv');

class ExError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
  }
}

module.exports = function validator({ data, schema }) {
  const validate = new Ajv({
    useDefaults: true,
    strictDefaults: true
  }).compile(schema);

  const valid = validate(data);

  if (!valid) {
    throw new ExError(
      'Not match the schema, Invalid configuration',
      validate.errors[0]
    );
  }

  return data;
};
