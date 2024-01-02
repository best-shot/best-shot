import { createRequire } from 'node:module';

import slash from 'slash';

import { notEmpty, targetIsNode } from '../lib/utils.mjs';

const require = createRequire(import.meta.url);

export function apply({ config: { node, hashbang, executor } }) {
  return async (chain) => {
    const target = chain.get('target');
    const watch = chain.get('watch');

    const isNode = targetIsNode(target);

    if (isNode) {
      const {
        default: { BannerPlugin },
      } = await import('webpack');

      chain.plugin('hashbang').use(BannerPlugin, [
        {
          ...hashbang,
          banner: '#!/usr/bin/env node',
          entryOnly: true,
          raw: true,
        },
      ]);
    }

    if (isNode) {
      chain.optimization.nodeEnv(false);
      chain.node(false);
    }

    if (notEmpty(node)) {
      chain.node.merge(node);
    }

    if (isNode && watch && executor) {
      const {
        default: { HotModuleReplacementPlugin },
      } = await import('webpack');

      chain.plugin('hmr').use(HotModuleReplacementPlugin);

      const { default: NodeHmrPlugin } = await import('node-hmr-plugin');

      chain.plugin('executor').use(NodeHmrPlugin, [
        {
          cmd:
            executor === 'node'
              ? '{app}'
              : `${slash(require.resolve('electron/cli.js'))} {app}`,
        },
      ]);

      Object.entries(chain.entryPoints.entries() || {}).forEach(([key]) => {
        chain
          .entry(key)
          .prepend('webpack/hot/poll?5000')
          .prepend(
            executor === 'electron'
              ? '@best-shot/core/reboot/electron.mjs'
              : '@best-shot/core/reboot/node.mjs',
          );
      });
    }
  };
}

export const name = 'node';

export const schema = {
  hashbang: {
    type: 'object',
    default: {
      include: ['bin.cjs', 'bin.mjs', 'cli.cjs', 'cli.mjs'],
    },
  },
  executor: {
    enum: ['node', 'electron'],
  },
};
