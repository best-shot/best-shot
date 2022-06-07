import extToRegexp from 'ext-to-regexp';

import { builtIn } from './built-in/index.mjs';
import { CoreChain } from './lib/chain.mjs';
import { importPresets } from './lib/presets.mjs';
import { Schema } from './lib/schema.mjs';

const cwd = process.cwd();

export class BestShot {
  constructor({ name, rootPath = cwd } = {}) {
    this.chain = new CoreChain({ name, context: rootPath });

    this.schema = new Schema();
    this.stack = new Set();

    builtIn.forEach((preset) => {
      this.use(preset);
    });

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

  async setup({
    config = {},
    mode = 'development',
    watch = false,
    serve = false,
    presets = [],
  } = {}) {
    if (presets.length > 0) {
      for (const preset of importPresets(presets)) {
        this.use(await preset());
      }
    }

    this.use({
      apply() {
        return (chain) => {
          chain.module
            .rule('esm')
            .test(extToRegexp({ extname: ['js', 'mjs'] }))
            .merge({ resolve: { fullySpecified: false } });
        };
      },
    });

    const local = mode === 'development' && watch;

    this.chain.mode(mode).watch(local).cache(local);

    const params = {
      serve: watch ? serve : false,
      config: await this.schema.validate(config),
    };

    for (const apply of this.stack) {
      await this.chain.asyncBatch(apply(params));
    }

    return this.chain;
  }
}
