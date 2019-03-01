const Ajv = require('ajv');
const { pretty, ExError } = require('../lib/common');

module.exports = function validator({ data, schema }) {
  const validate = new Ajv({
    useDefaults: true,
    strictDefaults: true
  }).compile(schema);
  const valid = validate(data);
  if (!valid) {
    throw new ExError(
      'Not match the schema, Invalid configuration',
      `info: ${pretty(validate.errors[0])}`
    );
  }
  return data;
};
