import WebpackChain from 'webpack-chain';

import { cachePath } from './utils.mjs';

export class CoreChain extends WebpackChain {
  constructor({ name, context }) {
    super();

    this.name(name).context(context);

    this.set('x', {
      cachePath: (...args) => {
        const configName = this.get('name') || 'default';
        return cachePath(configName, ...args);
      },
    });
  }

  toConfig() {
    this.delete('x');
    return super.toConfig();
  }

  toString() {
    this.delete('x');
    return super.toString();
  }

  async asyncBatch(handler) {
    await handler(this);
    return this;
  }
}
