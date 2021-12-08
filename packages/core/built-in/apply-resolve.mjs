import { notEmpty } from '../lib/utils.mjs';

export function apply({ config: { resolve: { alias } = {} } }) {
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
  };
}

export const name = 'resolve';

export const schema = {
  resolve: {
    type: 'object',
  },
};
