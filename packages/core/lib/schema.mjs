import { validate } from '@best-shot/validator';
import { deepmerge as deepMerge } from 'deepmerge-ts';

export class Schema {
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
    this.schema.properties = deepMerge(this.schema.properties, properties);
  }

  toObject() {
    return this.schema;
  }

  validate(data) {
    const { schema } = this;

    return validate({ data, schema });
  }
}
