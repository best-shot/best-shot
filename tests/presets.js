const test = require('ava').default;

const BestShot = require('../packages/core');

test('Right presets enum', (t) => {
  const io = new BestShot({ presets: ['babel'] });
  t.is(io.stack.store.additional.length, 1);
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

  t.is(io.stack.store.additional.length, presets.length);

  const { rules } = io.load().module;

  t.is(rules.has('babel'), true);
  t.is(rules.has('style'), true);
  t.is(rules.has('vue'), true);
});
