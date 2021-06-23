'use strict';

class ConfigError extends Error {
  constructor(message, detail) {
    super(message);
    this.name = 'ConfigError';
    this.detail = detail;
  }
}

let ajv;

module.exports = {
  ConfigError,
  validate({ data, schema }) {
    if (!ajv) {
      const Ajv = require('ajv');
      const addFormats = require('ajv-formats');
      const addKeywords = require('ajv-keywords');

      ajv = new Ajv({
        strict: true,
        useDefaults: true,
      });

      addFormats(ajv, ['regex']);
      addKeywords(ajv, ['instanceof', 'transform', 'uniqueItemProperties']);
    }

    const validator = ajv.compile(schema);

    const valid = validator(data);

    if (!valid) {
      throw new ConfigError('invalid configuration', validator.errors);
    }

    return data;
  },
};
