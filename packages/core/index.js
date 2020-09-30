const WebpackChain = require('webpack-chain');
const { importPresets } = require('./lib/presets');
const Stack = require('./lib/stack');
const Schema = require('./lib/schema');
const builtIn = require('./built-in');

const types = ['built-in', 'additional'];

module.exports = class BestShot {
  constructor({
    name = 'best-shot.config',
    rootPath = process.cwd(),
    presets = [],
  } = {}) {
    this.chain = new WebpackChain().name(name).context(rootPath);
    this.schema = new Schema();
    this.stack = new Stack();
    this.locked = false;

    builtIn.forEach((preset) => {
      this.use(preset, types[0]);
    });
    if (presets.length > 0) {
      importPresets(presets).forEach((preset) => {
        this.use(preset, types[1]);
      });
    }

    return this;
  }

  check() {
    if (this.locked) {
      throw new Error('Configuration has been loaded');
    }
  }

  use({ apply, schema, name = 'Unnamed' } = {}, type) {
    if (!types.includes(type)) {
      throw new Error(`Can't prepare ${type} presets: ${name}`);
    }

    if (typeof apply === 'function') {
      this.stack.add(type, apply);
    }
    if (typeof schema === 'object') {
      this.schema.merge(schema);
    }
    // TODO installed mark
  }

  load({
    config = {},
    mode = 'development',
    options: { watch = false } = {},
    platform = undefined,
  } = {}) {
    this.check();

    this.chain.mode(mode).watch(watch).cache(watch);

    const params = {
      config: this.schema.validate(config),
      platform,
    };

    this.stack.setup(params).forEach((apply) => {
      this.chain.batch(apply);
    });

    this.locked = true;

    return this.chain;
  }
};
