import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import slashToRegexp from 'slash-to-regexp';
import webpack from 'webpack';

import { notEmpty } from '../lib/utils.mjs';

const require = createRequire(import.meta.url);

function To(url, cwd) {
  if (url instanceof URL && url.protocol === 'file:') {
    return fileURLToPath(url.href);
  }

  if (typeof url === 'string') {
    if (url.startsWith('file:')) {
      return fileURLToPath(url);
    }

    if (url.startsWith('.')) {
      return resolve(cwd, url);
    }

    return require.resolve(url);
  }

  return url;
}

export function apply({
  cwd,
  config: { replace = [], resolve: { alias } = {} },
}) {
  return async (chain) => {
    if (notEmpty(alias)) {
      chain.resolve.alias.merge(alias);
    }

    const watch = chain.get('watch');

    if (!watch) {
      const CaseSensitivePathsPlugin = await import(
        'case-sensitive-paths-webpack-plugin'
      ).then(({ default: Plugin }) => Plugin);
      chain.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin);
    }

    (Array.isArray(replace) ? replace : [replace]).forEach(
      ({ from, to }, index) => {
        chain
          .plugin(`replace-${index}`)
          .use(webpack.NormalModuleReplacementPlugin, [
            typeof from === 'string' ? slashToRegexp(from) : from,
            To(to, cwd),
          ]);
      },
    );
  };
}

export const name = 'resolve';

const item = {
  type: 'object',
  properties: {
    from: {
      oneOf: [
        {
          type: 'string',
          minLength: 1,
        },
        {
          instanceof: 'RegExp',
        },
      ],
    },
    to: {
      oneOf: [
        {
          instanceof: 'URL',
        },
        {
          type: 'string',
          minLength: 1,
        },
        {
          typeof: 'function',
        },
      ],
    },
  },
};

export const schema = {
  resolve: {
    type: 'object',
  },
  replace: {
    oneOf: [
      item,
      {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: item,
        uniqueItemProperties: ['from', 'to'],
      },
    ],
  },
};
