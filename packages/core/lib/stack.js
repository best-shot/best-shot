module.exports = class Stack {
  constructor() {
    this.store = new Set();
    return this;
  }

  add(apply) {
    this.store.add(apply);
  }

  setup(callback) {
    return this.store.forEach((apply) => callback(apply));
  }
};
