'use strict';

const { resolve } = require('path');

exports.name = 'basic';

const shorthand = {
  development: 'dev',
  production: 'prod',
};

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

    if (!watch) {
      chain.output.set('clean', true);
    }
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
    title: 'Same as `target` of `webpack` configuration',
    oneOf: [
      string,
      {
        type: 'array',
        uniqueItems: true,
        items: string,
      },
    ],
  },
};
