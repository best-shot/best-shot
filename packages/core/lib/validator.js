const Ajv = require('ajv');
const { EOL } = require('os');
const { cyan } = require('chalk');
const betterAjvErrors = require('better-ajv-errors');

module.exports = function validator({ data, schema }) {
  const validate = new Ajv({
    jsonPointers: true,
    strictDefaults: true,
    useDefaults: true,
  }).compile(schema);

  const valid = validate(data);

  if (!valid) {
    const isOneOf = validate.errors.slice(-1)[0].keyword === 'oneOf';

    const output = betterAjvErrors(
      schema,
      data,
      isOneOf ? validate.errors.slice(-1) : validate.errors,
      { indent: 2 },
    );

    const types = isOneOf
      ? validate.errors
          .filter(({ keyword }) => keyword === 'type')
          // @ts-ignore
          .map(({ params: { type } }) => type)
          .join('/')
      : undefined;

    console.log(
      cyan(' BEST-SHOT:'),
      'invalid configuration:',
      EOL,
      EOL, // @ts-ignore
      (isOneOf ? output.replace('oneOf', `oneOf: ${types}`) : output).replace(
        /👈🏽.*\n/,
        '\n',
      ),
      EOL,
    );

    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  return data;
};
