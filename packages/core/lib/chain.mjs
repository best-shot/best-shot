import WebpackChain from 'webpack-chain';

import { cachePath } from './utils.mjs';

export class CoreChain extends WebpackChain {
  constructor({ name, context }) {
    super();

    this.name(name).context(context);

    this.temp = [];

    this.set('x', {
      cachePath: (path) => {
        const configName = this.get('name') || 'default';

        return cachePath(configName, path);
      },
      addHooks: (...funcs) => {
        this.temp.push(...funcs);
      },
    });
  }

  toConfig() {
    this.delete('x');

    const io = super.toConfig();

    for (const func of this.temp) {
      func(io);
    }

    return io;
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
