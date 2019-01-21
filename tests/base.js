const BestShot = require('@best-shot/core');

const baseSchema = require('../packages/core/schema/base-schema.json');

const {
  schema: properties1
} = require('../packages/core/built-in/before/apply-entry');
const {
  schema: properties2
} = require('../packages/core/built-in/after/apply-define');

const example = {
  name: 'best-shot.config',
  target: 'web',
  mode: 'production',
  output: {
    publicPath: '/',
    filename: '[name].js'
  }
};

describe('Base Config', () => {
  test('toConfig', () => {
    const config = new BestShot().load().toConfig();
    expect(config).toMatchObject(example);
  });

  test('toString', () => {
    const config = new BestShot().load().toString();
    expect(config).toMatch(/^\{/);
    expect(config).toMatch(/\}$/);
  });

  test('toSchema', () => {
    const schema = new BestShot().schema.toObject();

    Object.assign(baseSchema.properties, properties1, properties2);
    expect(schema).toMatchObject(baseSchema);
  });
});
