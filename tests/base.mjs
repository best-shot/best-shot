import * as define from '@best-shot/core/built-in/apply-define.mjs';
import { BestShot } from '@best-shot/core/index.mjs';
import { Schema } from '@best-shot/core/lib/schema.mjs';
import test from 'ava';

const example = {
  mode: 'development',
  output: {
    filename: '[name].js',
  },
};

test('toConfig', async (t) => {
  const chain = await new BestShot().setup();
  const config = chain.toConfig();
  t.like(config, example);
});

test('toString', async (t) => {
  const chain = await new BestShot().setup();
  const config = chain.toString();
  t.regex(config, /^\{/);
  t.regex(config, /\}$/);
});

test('toSchema', (t) => {
  const schema = new BestShot().schema.toObject();
  const baseSchema = new Schema().schema;

  Object.assign(baseSchema.properties, define.schema);

  t.like(schema, baseSchema);
});

test('entryPoints', async (t) => {
  const chain1 = await new BestShot().setup({
    config: { entry: 'index.js' },
  });
  const stringEntry = chain1.toConfig().entry;

  const chain2 = await new BestShot().setup({
    config: { entry: ['index.js'] },
  });
  const arrayEntry = chain2.toConfig().entry;

  const chain3 = await new BestShot().setup({
    config: { entry: { main: 'index.js' } },
  });
  const objectEntry = chain3.toConfig().entry;

  t.deepEqual(stringEntry, arrayEntry);
  t.deepEqual(stringEntry, objectEntry);
});
