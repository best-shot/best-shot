const test = require('ava');

const BestShot = require('../packages/core');

test('Right presets enum', (t) => {
  const io = new BestShot({ presets: ['babel'] });
  t.is(io.stack.store.additional.length, 1);
});

test('Wrong presets enum', (t) => {
  t.throws(
    () => {
      // eslint-disable-next-line no-new
      new BestShot({ presets: ['abc'] });
    },
    {
      instanceOf: Error,
      message: /^Presets only allow \[.+]/,
    },
  );
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
  const io = new BestShot({
    presets: ['babel', 'style', 'vue', 'web'],
  });
  t.is(io.stack.store.additional.length, 4);
  const { rules } = io.load().module;
  t.is(rules.has('babel'), true);
  t.is(rules.has('style'), true);
  t.is(rules.has('vue'), true);
});
