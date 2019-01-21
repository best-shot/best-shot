module.exports = class Stack {
  constructor() {
    this.store = Object.freeze({ before: [], presets: [], after: [] });
    return this;
  }

  add(type, apply) {
    this.store[type].push(apply);
  }

  setup(params) {
    const { before, after, presets } = this.store;
    return [...before, ...presets, ...after].map(apply => apply(params));
  }
};
