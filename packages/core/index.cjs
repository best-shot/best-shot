const WebpackChain = require('webpack-chain');
const { importPresets } = require('./lib/presets.cjs');
const Stack = require('./lib/stack.cjs');
const Schema = require('./lib/schema.cjs');
const builtIn = require('./built-in/index.cjs');

module.exports = class BestShot {
  constructor({ name, rootPath = process.cwd(), presets = [] } = {}) {
    this.chain = new WebpackChain().name(name).context(rootPath);
    this.schema = new Schema();
    this.stack = new Stack();

    builtIn.forEach((preset) => {
      this.use(preset);
    });
    if (presets.length > 0) {
      importPresets(presets).forEach((preset) => {
        this.use(preset);
      });
    }

    return this;
  }

  use({ apply, schema }) {
    if (typeof apply === 'function') {
      this.stack.add(apply);
    }
    if (typeof schema === 'object') {
      this.schema.merge(schema);
    }
  }

  setup({ config = {}, mode = 'development', watch = false } = {}) {
    const params = { config: this.schema.validate(config) };

    const local = mode === 'development' && watch;

    this.chain.mode(mode).watch(local).cache(local);

    this.stack.setup((apply) => {
      this.chain.batch(apply(params));
    });

    return this.chain;
  }
};
