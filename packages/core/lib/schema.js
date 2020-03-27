const deepmerge = require('deepmerge');

const validator = require('./validator');

module.exports = class Schema {
  constructor() {
    this.schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      description: 'Configuration of best-shot',
      type: 'object',
      properties: {
        experimental: {
          type: 'object'
        }
      }
    };
    return this;
  }

  merge(properties) {
    this.schema = deepmerge(this.schema, { properties });
  }

  toObject() {
    return this.schema;
  }

  validate(data) {
    return validator({ data, schema: this.schema });
  }
};
