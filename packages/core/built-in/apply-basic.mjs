import { resolve } from 'path';

import { notEmpty, targetIsNode } from '../lib/utils.mjs';

export function apply({
  config: {
    output: { publicPath, path, module: useModule } = {},
    output = {},
    target,
    node,
    dependencies,
  },
}) {
  return (chain) => {
    chain.amd(false);

    if (target) {
      chain.target(target);
    }

    if (dependencies) {
      chain.set('dependencies', dependencies);
    }

    const context = chain.get('context');
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    chain.devtool(false);

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

    const isNode = targetIsNode(target);

    if (isNode) {
      chain.optimization.nodeEnv(false);
      chain.set('node', false);
    } else if (notEmpty(node)) {
      chain.node.merge(node);
    }

    chain.output.filename(
      isNode ? (useModule ? '[name].mjs' : '[name].cjs') : '[name].js',
    );

    if (!watch) {
      chain.output.set('clean', true);
    }

    if (publicPath !== undefined) {
      chain.output.publicPath(publicPath);
    }

    if (useModule) {
      chain.merge({ experiments: { outputModule: true } });

      chain.output.set('library', {
        type: 'module',
      });
    } else if (isNode) {
      chain.output.set('library', {
        type: 'commonjs-static',
      });
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
        importMeta: !isNode,
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
