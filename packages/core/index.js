'use strict';

const WebpackChain = require('webpack-chain');
const { importPresets } = require('./lib/presets');
const Stack = require('./lib/stack');
const builtIn = require('./built-in');
const Schema = require('./schema');

const types = ['built-in', 'additional'];

const defaultOptions = {
  watch: false,
  serve: false
};

module.exports = class BestShot {
  constructor({ name = 'best-shot.config', presets = [] } = {}) {
    this.chain = new WebpackChain().name(name);
    this.schema = new Schema();
    this.stack = new Stack();
    this.locked = false;

    builtIn.forEach(preset => {
      this.use(preset, types[0]);
    });
    if (presets.length > 0) {
      importPresets(presets).forEach(preset => {
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
      throw new Error(`Can't use ${type} presets: [${name}]`);
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
    browsers = [],
    config = {},
    dependencies = {},
    mode = 'production',
    options = { ...defaultOptions },
    platform,
    rootPath = process.cwd()
  } = {}) {
    this.check();

    if (!rootPath) {
      throw new Error('rootPath is required');
    }

    const params = {
      browsers,
      config: this.schema.validate(config),
      dependencies,
      mode,
      options: mode === 'development' ? options : defaultOptions,
      platform,
      rootPath
    };

    this.stack.setup(params).forEach(apply => {
      this.chain.batch(apply);
    });

    this.locked = true;

    return this.chain;
  }
};
