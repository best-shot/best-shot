// eslint-disable-next-line import/no-extraneous-dependencies
const BestShot = require('@best-shot/core');

const Schema = require('../packages/core/lib/schema');

const {
  schema: properties1
} = require('../packages/core/built-in/apply-entry');
const {
  schema: properties2
} = require('../packages/core/built-in/apply-define');

const example = {
  name: 'best-shot.config',
  target: 'web',
  mode: 'development',
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
    expect(config).toMatch(/^{/);
    expect(config).toMatch(/}$/);
  });

  test('toSchema', () => {
    const schema = new BestShot().schema.toObject();
    const baseSchema = new Schema().schema;
    Object.assign(baseSchema.properties, properties1, properties2);
    expect(schema).toMatchObject(baseSchema);
  });
});
