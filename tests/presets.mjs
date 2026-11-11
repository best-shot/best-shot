import { builtIn } from '@best-shot/core/built-in/index.mjs';
import { BestShot } from '@best-shot/core/index.mjs';
import test from 'ava';

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

function getPlugins(chain) {
  return chain.module.rule('babel').uses.get('babel-loader').get('options')
    .plugins;
}

test('React compiler opt-in', async (t) => {
  const chain1 = await new BestShot().setup({
    presets: ['babel', 'react'],
    config: { react: { compiler: true } },
  });

  const [first] = getPlugins(chain1);

  t.is(Array.isArray(first) ? first[0] : first, 'babel-plugin-react-compiler');
  t.deepEqual(first[1], { target: '18' });

  const chain2 = await new BestShot().setup({ presets: ['babel', 'react'] });

  t.false(getPlugins(chain2).some((plugin) => String(plugin).includes('babel-plugin-react-compiler')));
});
