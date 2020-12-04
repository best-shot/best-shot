const Ajv = require('ajv');
const { EOL } = require('os');
const { red } = require('chalk');
const betterAjvErrors = require('better-ajv-errors');

module.exports = function validate({ data, schema }) {
  const validator = new Ajv({
    jsonPointers: true,
    strictDefaults: true,
    useDefaults: true,
  }).compile(schema);

  const valid = validator(data);

  if (!valid) {
    const output = betterAjvErrors(
      schema,
      data,
      [validator.errors.find((error) => error.dataPath !== '')],
      { indent: 2 },
    );

    console.log(
      red('Error:'),
      'invalid configuration',
      EOL,
      EOL, // @ts-ignore
      output.replace(/👈🏽.*\n/, '\n'),
      EOL,
    );

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  return data;
};
