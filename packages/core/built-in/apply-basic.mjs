import { resolve } from 'path';

import { targetIsNode } from '../lib/utils.mjs';

export function apply({
  config: { output: { publicPath, path } = {}, output = {}, target },
}) {
  return (chain) => {
    chain.amd(false);

    if (target) {
      chain.target(target);
    }

    const context = chain.get('context');
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.optimization
      .removeAvailableModules(true)
      .minimize(mode === 'production');

    if (watch) {
      chain.watchOptions({ ignored: /node_modules/ });
      chain.output.pathinfo(false);
      chain.optimization
        .removeAvailableModules(false)
        .removeEmptyChunks(false)
        .set('innerGraph', false);
    }

    chain.module.strictExportPresence(!watch);

    const name = chain.get('name') || '';

    chain.output.filename(targetIsNode(target) ? '[name].cjs' : '[name].js');

    if (!watch) {
      chain.output.set('clean', true);
    }

    if (publicPath !== undefined) {
      chain.output.publicPath(publicPath);
    }

    chain.output.merge(output);

    chain.output.path(
      resolve(
        context,
        path.replace(/\[config-name]/g, name).replace(/\[mode]/g, mode),
      ),
    );

    chain.module.set('parser', {
      javascript: {
        amd: false,
        requireJs: false,
        system: false,
        importMeta: !targetIsNode(target),
      },
    });
  };
}

export const name = 'basic';

export const schema = {
  output: {
    type: 'object',
    default: {},
    properties: {
      path: {
        default: 'dist',
        description:
          'It can be a relative path. Additional placeholder: [mode][config-name]',
        minLength: 1,
        type: 'string',
      },
    },
  },
};
