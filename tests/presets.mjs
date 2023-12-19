import test from 'ava';

import { builtIn } from '../packages/core/built-in/index.mjs';
import { BestShot } from '../packages/core/index.mjs';

test('Right presets enum', (t) => {
  const io = new BestShot();
  t.is(io.stack.size, builtIn.length);
});

test('Prevent React and Vue', async (t) => {
  await t.throwsAsync(
    async () => {
      await new BestShot().setup({ presets: ['vue', 'react'] });
    },
    {
      instanceOf: Error,
      message: "Don't use React and Vue at the same time",
    },
  );
});

test('More presets', async (t) => {
  const presets = ['babel', 'style', 'vue', 'web', 'asset'];

  const chain = await new BestShot().setup({ presets });

  const { rules } = chain.module;

  t.is(rules.has('babel'), true);
  t.is(rules.has('style'), true);
  t.is(rules.has('vue'), true);
  t.is(rules.has('image'), true);
  t.is(rules.has('micro-tpl'), true);
});
