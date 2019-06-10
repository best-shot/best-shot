'use strict';

module.exports = class Stack {
  constructor() {
    this.store = Object.freeze({
      'built-in': [],
      additional: []
    });
    return this;
  }

  add(type, apply) {
    this.store[type].push(apply);
  }

  setup(params) {
    const { additional, 'built-in': builtIn } = this.store;
    return [...builtIn, ...additional].map(apply => apply(params));
  }
};
