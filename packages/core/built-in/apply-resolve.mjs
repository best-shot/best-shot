import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import slashToRegexp from 'slash-to-regexp';
import webpack from 'webpack';

import { notEmpty } from '../lib/utils.mjs';

function To(to) {
  let url = to;

  if (url instanceof URL && url.protocol === 'file:') {
    url = fileURLToPath(url.href);
  }

  if (typeof url === 'string') {
    if (url.startsWith('file:')) {
      url = fileURLToPath(url);
    }

    if (url.startsWith('.')) {
      url = resolve(process.cwd(), url);
    }
  }

  return url;
}

export function apply({ config: { replace = [], resolve: { alias } = {} } }) {
  return async (chain) => {
    chain.resolve.merge({
      extensions: ['.js', '.cjs', '.mjs', '.json'],
      modules: ['node_modules'],
    });

    if (notEmpty(alias)) {
      chain.resolve.alias.merge(alias);
    }

    chain.resolveLoader.modules.prepend('node_modules');

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
            To(to),
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
