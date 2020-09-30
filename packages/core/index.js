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
  }

  load({
    config = {},
    mode = 'development',
    options: { watch = false } = {},
    platform = undefined,
  } = {}) {
    this.chain.mode(mode).watch(watch).cache(watch);

    const params = {
      config: this.schema.validate(config),
      platform,
    };

    this.stack.setup(params).forEach((apply) => {
      this.chain.batch(apply);
    });

    return this.chain;
  }
};
