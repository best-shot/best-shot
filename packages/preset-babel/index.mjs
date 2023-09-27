import { relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import browserslist from 'browserslist';
import extToRegexp from 'ext-to-regexp';
import slashToRegexp from 'slash-to-regexp';

function getList({ path, env }) {
  const config = browserslist.loadConfig({ path, env });

  return config && config.length > 0 ? config : browserslist.defaults;
}

export function apply({
  config: { babel: { polyfill = false, env = 'auto' } = {} },
}) {
  return (chain) => {
    const mode = chain.get('mode');
    const context = chain.get('context');
    const watch = chain.get('watch');

    const { cachePath } = chain.get('x');

    chain.module
      .rule('babel')
      .before('esm')
      .test(extToRegexp({ extname: ['js', 'mjs', 'cjs', 'ts'] }))
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        babelrc: false,
        cacheCompression: false,
        cacheDirectory: watch ? cachePath('babel') : false,
        compact: mode === 'production',
        envName: mode,
        sourceType: 'unambiguous',
        targets: getList({
          path: context,
          env: mode,
        }),
        presets:
          watch && env === 'auto'
            ? ['@babel/typescript']
            : [['evergreen', { polyfill }], '@babel/typescript'],
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

    chain.resolveLoader.modules.prepend(
      relative(
        context,
        resolve(fileURLToPath(import.meta.url), '../node_modules'),
      ),
    );
  };
}

export const name = 'preset-babel';

export const schema = {
  babel: {
    default: {},
    type: 'object',
    properties: {
      polyfill: {
        default: false,
        description:
          'References: <https://github.com/babel/babel/issues/10008>',
        enum: [false, 'global', 'pure'],
        title: 'How `babel` handles polyfills',
      },
      env: {
        default: 'auto',
        enum: ['always', 'auto'],
        description:
          "When 'always', `babel-preset-evergreen` will enabled in watch mode",
      },
    },
  },
};
