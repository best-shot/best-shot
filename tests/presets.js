const BestShot = require('@best-shot/core');

describe('Add Presets', () => {
  test('Right presets enum', () => {
    const io = new BestShot({ presets: ['babel'] });
    expect(io.stack.store.presets.length).toBe(1);
  });

  test('Wrong presets enum', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const io = new BestShot({ presets: ['abc'] });
    }).toThrow(/^Presets only allow /);
  });

  test('Prevent React and Vue', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const io = new BestShot({ presets: ['vue', 'react'] });
    }).toThrow(/^Don't use React and Vue at the same time$/);
  });

  test('More presets', () => {
    const io = new BestShot({
      presets: ['babel', 'style', 'vue', 'web']
    });
    const { rules } = io.load().module;
    expect(rules.has('babel')).toBe(true);
    expect(rules.has('style')).toBe(true);
    expect(rules.has('vue')).toBe(true);
  });
});
