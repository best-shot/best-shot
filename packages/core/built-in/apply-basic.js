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
  platform = '',
}) {
  return (chain) => {
    chain.amd(false).target(target);

    const context = chain.get('context');
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    if (watch) {
      chain.watchOptions({ ignored: /node_modules/ });
      chain.output.pathinfo(false);
    }

    chain.module.strictExportPresence(!watch);

    chain.optimization
      .minimize(mode === 'production')
      .removeAvailableModules(!watch)
      .removeEmptyChunks(!watch);

    if (is5) {
      if (mode === 'production') {
        const type = 'deterministic';
        chain.optimization.set('moduleIds', type).set('chunkIds', type);
      }
    } else {
      const type = mode === 'production' ? 'hashed' : 'named';
      chain.optimization.set('moduleIds', type).set('chunkIds', type);
    }

    chain.output
      .publicPath(publicPath)
      .filename('[name].js')
      .path(
        resolve(
          context,
          outputPath
            .replace(/\[platform]/g, platform)
            .replace(/\[mode]/g, mode)
            .replace(/\[mode:shorthand]/g, shorthand[mode]),
        ),
      );

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
      'It can be a relative path. Additional placeholder: [mode]/[mode:shorthand]/[platform]',
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
    default: 'web',
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
