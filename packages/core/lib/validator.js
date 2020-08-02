const Ajv = require('ajv');
const { EOL } = require('os');
const betterAjvErrors = require('better-ajv-errors');

module.exports = function validator({ data, schema }) {
  const validate = new Ajv({
    jsonPointers: true,
    strictDefaults: true,
    useDefaults: true,
  }).compile(schema);

  const valid = validate(data);

  if (!valid) {
    const output = betterAjvErrors(schema, data, validate.errors.slice(-1), {
      indent: 2,
    });

    // @ts-ignore
    console.log('Invalid config:', output.replace(/👈🏽.*\n/, '\n'), EOL);

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  return data;
};
