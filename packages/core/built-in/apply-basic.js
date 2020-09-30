const { resolve } = require('path');

exports.name = 'basic';

const shorthand = {
  development: 'dev',
  production: 'prod',
};

exports.apply = function applyBasic({
  config: { publicPath, outputPath },
  platform = '',
}) {
  return (chain) => {
    chain.amd(false).target('web');

    const context = chain.get('context');
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    if (watch) {
      chain.watchOptions({
        ignored: /node_modules/,
      });
    }

    chain.module.strictExportPresence(!watch);

    chain.optimization
      .minimize(mode === 'production')
      .set('moduleIds', mode === 'production' ? 'hashed' : 'named');

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
      Buffer: false,
      global: false,
      process: false,
      setImmediate: false,
    });
  };
};

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
    default: '/',
    title: 'Same as `output.publicPath` of `webpack`',
    type: 'string',
    oneOf: [
      {
        const: '',
      },
      {
        pattern: '\\/$',
      },
    ],
  },
};
