const Ajv = require('ajv');
const betterAjvErrors = require('better-ajv-errors');

class ConfigError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = 'ConfigError';
    this.detail = detail;
  }
}

module.exports = {
  ConfigError,
  validate({ data, schema }) {
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

      throw new ConfigError(
        'invalid configuration',
        // @ts-ignore
        output.replace(/👈🏽.*\n/, '\n'),
      );
    }

    return data;
  },
};
