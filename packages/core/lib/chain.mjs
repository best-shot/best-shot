import WebpackChain from '@best-shot/webpack-chain';

import { cachePath } from './utils.mjs';

export class BaseChain extends WebpackChain {
  constructor() {
    super();
    this.amd(false);

    this.experiments
      .cacheUnaffected(true)
      .asyncWebAssembly(true)
      .syncWebAssembly(true)
      .topLevelAwait(true);

    this.output.hashDigestLength(8);

    this.resolve.extensions.merge(['.js', '.cjs', '.mjs', '.json', '.ts']);
  }
}

export class CoreChain extends BaseChain {
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

    if (io.entry) {
      for (const [key, item] of Object.entries(io.entry)) {
        if (
          Array.isArray(item) &&
          item.length === 1 &&
          typeof item[0] !== 'string'
        ) {
          // eslint-disable-next-line prefer-destructuring
          io.entry[key] = item[0];
        }
      }
    }

    return io;
  }

  toString() {
    this.delete('x');

    return super.toString({ verbose: true });
  }

  async asyncBatch(handler) {
    await handler(this);

    return this;
  }
}
