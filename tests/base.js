// eslint-disable-next-line node/no-extraneous-require
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

  test('entryPoints', () => {
    const stringEntry = new BestShot()
      .load({ config: { entry: 'index.js' } })
      .toConfig().entry;
    const arrayEntry = new BestShot()
      .load({ config: { entry: ['index.js'] } })
      .toConfig().entry;
    const objectEntry = new BestShot()
      .load({ config: { entry: { main: 'index.js' } } })
      .toConfig().entry;

    expect(stringEntry).toEqual(arrayEntry);
    expect(stringEntry).toEqual(objectEntry);
  });
});
