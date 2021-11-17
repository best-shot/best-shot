import test from 'ava';

import builtIn from '../packages/core/built-in/index.cjs';
import BestShot from '../packages/core/index.cjs';

test('Right presets enum', (t) => {
  const io = new BestShot({ presets: ['babel'] });
  t.is(io.stack.store.size, 1 + builtIn.length);
});

test('Prevent React and Vue', (t) => {
  t.throws(
    () => {
      // eslint-disable-next-line no-new
      new BestShot({ presets: ['vue', 'react'] });
    },
    {
      instanceOf: Error,
      message: "Don't use React and Vue at the same time",
    },
  );
});

test('More presets', (t) => {
  const presets = ['babel', 'style', 'vue'];

  const io = new BestShot({ presets });

  t.is(io.stack.store.size, presets.length + builtIn.length);

  const { rules } = io.setup().module;

  t.is(rules.has('babel'), true);
  t.is(rules.has('style'), true);
  t.is(rules.has('vue'), true);
});
