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

test('Built-in TypeScript parsing enabled', async (t) => {
  const chain = await new BestShot().setup();
  t.is(chain.toConfig().experiments.typescript, true);
});

test('JS minimizer uses built-in path, mini keeps terser', async (t) => {
  const web = await new BestShot().setup({ mode: 'production' });
  const webConfig = web.toConfig();
  // No manual terser minimizer; options fed to the built-in minimizer.
  t.is(webConfig.optimization.minimizer, undefined);
  t.truthy(webConfig.optimization.minimizeOptions.javascript);
  t.true(webConfig.optimization.minimizeOptions.javascript.compress.passes === 2);

  const mini = await new BestShot().setup({
    presets: ['mini'],
    mode: 'production',
  });
  const miniConfig = mini.toConfig();
  t.is(miniConfig.optimization.minimizeOptions.javascript, false);
  t.true(
    miniConfig.optimization.minimizer.some(
      (item) => item?.constructor?.name === 'TerserPlugin',
    ),
  );
});

test('Duplicated import.meta.env flags removed', async (t) => {
  const chain = await new BestShot().setup({ mode: 'production' });
  const definitions = chain.plugins.get('define').get('args')[0];

  t.false(Object.hasOwn(definitions, 'import.meta.env.PROD'));
  t.false(Object.hasOwn(definitions, 'import.meta.env.DEV'));
  t.false(Object.hasOwn(definitions, 'import.meta.env.MODE'));
  // best-shot-specific fields remain.
  t.true(Object.hasOwn(definitions, 'import.meta.env.GIT_HASH'));
  t.true(Object.hasOwn(definitions, 'import.meta.env.WATCHING'));
});
