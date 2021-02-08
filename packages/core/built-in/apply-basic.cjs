const { resolve } = require('path');

const { version } = require('webpack/package.json');

exports.name = 'basic';

const shorthand = {
  development: 'dev',
  production: 'prod',
};

const is5 = version.startsWith('5.');

exports.apply = function applyBasic({
  config: { publicPath, outputPath, target },
}) {
  return (chain) => {
    chain.amd(false);

    if (target) {
      chain.target(target);
    }

    const context = chain.get('context');
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    if (watch) {
      chain.watchOptions({ ignored: /node_modules/ });
      chain.output.pathinfo(false);
      chain.optimization.removeAvailableModules(false).removeEmptyChunks(false);
    }

    chain.module.strictExportPresence(!watch);

    chain.optimization.minimize(mode === 'production');

    if (!is5) {
      const type = mode === 'production' ? 'hashed' : 'named';
      chain.optimization.set('moduleIds', type);
    }

    const name = chain.get('name');

    chain.output
      .publicPath(publicPath)
      .filename('[name].js')
      .path(
        resolve(
          context,
          outputPath
            .replace(/\[config-name]/g, name || '')
            .replace(/\[mode]/g, mode)
            .replace(/\[mode:shorthand]/g, shorthand[mode]),
        ),
      );

    chain.output.when(name, (output) => {
      output.path(output.get('path'));
    });

    chain.node.merge({
      __dirname: true,
      __filename: true,
      global: false,
      ...(is5
        ? undefined
        : {
            Buffer: false,
            process: false,
            setImmediate: false,
          }),
    });
  };
};

const string = { type: 'string' };

exports.schema = {
  outputPath: {
    default: 'dist',
    description:
      'It can be a relative path. Additional placeholder: [mode]/[mode:shorthand]/',
    minLength: 3,
    title: 'Same as `output.path` of `webpack`',
    type: 'string',
  },
  publicPath: {
    default: '',
    title: 'Same as `output.publicPath` of `webpack` configuration',
    type: 'string',
    oneOf: [{ const: '' }, { pattern: '\\/$' }],
  },
  target: {
    default: is5 ? undefined : 'web',
    title: 'Same as `target` of `webpack` configuration',
    ...(is5
      ? {
          oneOf: [
            string,
            {
              type: 'array',
              uniqueItems: true,
              items: string,
            },
          ],
        }
      : string),
  },
};
