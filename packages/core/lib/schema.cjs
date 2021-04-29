const deepmerge = require('deepmerge');

const { validate } = require('./validate.cjs');

module.exports = class Schema {
  constructor() {
    this.schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      description: 'Configuration of best-shot',
      type: 'object',
      properties: {},
    };
    return this;
  }

  merge(properties) {
    this.schema.properties = deepmerge(this.schema.properties, properties);
  }

  toObject() {
    return this.schema;
  }

  validate(data) {
    return validate({ data, schema: this.schema });
  }
};
