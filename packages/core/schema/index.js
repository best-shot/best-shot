'use strict';

const deepmerge = require('deepmerge');

const validator = require('./validator');
const baseSchema = require('./base-schema.json');

module.exports = class Schema {
  constructor() {
    this.schema = baseSchema;
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
