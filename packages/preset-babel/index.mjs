import { fileURLToPath } from 'node:url';

import browserslist from 'browserslist';
import extToRegexp from 'ext-to-regexp';
import slashToRegexp from 'slash-to-regexp';

function getList({ path, env }) {
  const config = browserslist.loadConfig({ path, env });

  return config && config.length > 0 ? config : browserslist.defaults;
}

export function apply({
  cwd,
  config: { babel: { polyfill = false, env = 'always' } = {} },
}) {
  return (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');

    const { cachePath } = chain.get('x');

    chain.resolve.extensionAlias.merge({
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    });

    const typescriptPreset = [
      '@babel/typescript',
      { allowDeclareFields: true },
    ];

    chain.module
      .rule('babel')
      .before('esm')
      .test(extToRegexp({ extname: ['js', 'mjs', 'cjs', 'ts', 'mts', 'cts'] }))
      .use('babel-loader')
      .loader(fileURLToPath(import.meta.resolve('babel-loader')))
      .options({
        babelrc: false,
        cacheCompression: false,
        cacheDirectory: watch ? cachePath('babel') : false,
        compact: mode === 'production',
        envName: mode,
        sourceType: 'unambiguous',
        targets: getList({
          path: cwd,
          env: mode,
        }),
        presets:
          watch && env === 'auto'
            ? [typescriptPreset]
            : [['evergreen', { polyfill }], typescriptPreset],
      });

    const serve = chain.devServer.entries() !== undefined;

    if (watch && env === 'auto') {
      chain.module.rule('babel').exclude.add(/[/\\]node_modules[/\\].+\.js$/);
    } else {
      chain.module
        .rule('babel')
        .exclude.add(
          slashToRegexp(
            serve
              ? '/node_modules/webpack(-dev-server)?/'
              : '/node_modules/webpack/',
          ),
        );

      if (polyfill) {
        chain.module
          .rule('babel')
          .exclude.add(slashToRegexp('/node_modules/core-js(-pure)?/'));
      }
    }
  };
}

export const name = 'preset-babel';

export const schema = {
  babel: {
    default: {},
    type: 'object',
    properties: {
      polyfill: {
        default: {
          usage: 'global',
          mini: false,
        },
        description:
          'References: <https://github.com/babel/babel/issues/10008>',
        title: 'How `babel` handles polyfills',
        oneOf: [
          { const: false },
          {
            type: 'object',
            properties: {
              usage: {
                enum: ['global', 'pure'],
              },
              mini: {
                type: 'boolean',
              },
            },
          },
        ],
      },
      env: {
        default: 'always',
        enum: ['always', 'auto'],
        description:
          "When 'always', `babel-preset-evergreen` will enabled in watch mode",
      },
    },
  },
};
