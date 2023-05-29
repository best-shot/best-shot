import test from 'ava';

import * as define from '../packages/core/built-in/apply-define.mjs';
import * as entry from '../packages/core/built-in/apply-entry.mjs';
import { BestShot } from '../packages/core/index.mjs';
import { Schema } from '../packages/core/lib/schema.mjs';

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
  t.regex(config, /^{/);
  t.regex(config, /}$/);
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
