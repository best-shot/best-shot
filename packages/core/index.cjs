'use strict';

const { importPresets } = require('./lib/presets.cjs');
const Stack = require('./lib/stack.cjs');
const Schema = require('./lib/schema.cjs');
const { cachePath } = require('./lib/utils.cjs');
const builtIn = require('./built-in/index.cjs');

const cwd = process.cwd();

function BaseChain(name, rootPath) {
  const WebpackChain = require('webpack-chain');

  class Chain extends WebpackChain {
    toConfig() {
      super.delete('x');
      return super.toConfig();
    }

    toString() {
      super.delete('x');
      return super.toString();
    }
  }

  const chain = new Chain().name(name).context(rootPath);

  chain.set('x', {
    cachePath: (...args) => {
      const configName = chain.get('name') || 'default';
      return cachePath(configName, ...args);
    },
  });

  return chain;
}

module.exports = class BestShot {
  constructor({ name = 'best-shot', rootPath = cwd, presets = [] } = {}) {
    this.chain = BaseChain(name, rootPath);
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
