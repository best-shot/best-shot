const test = require('ava').default;

const BestShot = require('../packages/core');
const Schema = require('../packages/core/lib/schema');

const {
  schema: properties1,
} = require('../packages/core/built-in/apply-entry');
const {
  schema: properties2,
} = require('../packages/core/built-in/apply-define');

const example = {
  name: 'best-shot.config',
  mode: 'development',
  output: {
    publicPath: '',
    filename: '[name].js',
  },
};

test('toConfig', (t) => {
  const config = new BestShot().load().toConfig();
  t.like(config, example);
});

test('toString', (t) => {
  const config = new BestShot().load().toString();
  t.regex(config, /^{/);
  t.regex(config, /}$/);
});

test('toSchema', (t) => {
  const schema = new BestShot().schema.toObject();
  const baseSchema = new Schema().schema;
  Object.assign(baseSchema.properties, properties1, properties2);
  t.like(schema, baseSchema);
});

test('entryPoints', (t) => {
  const stringEntry = new BestShot()
    .load({ config: { entry: 'index.js' } })
    .toConfig().entry;
  const arrayEntry = new BestShot()
    .load({ config: { entry: ['index.js'] } })
    .toConfig().entry;
  const objectEntry = new BestShot()
    .load({ config: { entry: { main: 'index.js' } } })
    .toConfig().entry;

  t.deepEqual(stringEntry, arrayEntry);
  t.deepEqual(stringEntry, objectEntry);
});
