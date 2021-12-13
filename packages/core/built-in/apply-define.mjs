import Git from '@nice-labs/git-rev/dist/git.js';
import mapValues from 'lodash/mapValues.js';
import pickBy from 'lodash/pickBy.js';

function variables(object) {
  return mapValues(
    pickBy(object, (item) => item !== undefined && item !== ''),
    (value) => JSON.stringify(value),
  );
}

const displayName = 'define';

function getGitHash() {
  try {
    return new Git().commitHash();
  } catch {
    return 'noop';
  }
}

export function apply({ config: { define } }) {
  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const name = chain.get('name');

    const {
      default: { DefinePlugin },
    } = await import('webpack');

    const GIT_HASH = getGitHash();

    chain.plugin(displayName).use(DefinePlugin, [
      variables({
        ...define,
        'BEST_SHOT.MODE': mode,
        'BEST_SHOT.WATCHING': watch,
        'BEST_SHOT.CONFIG_NAME': name,
        'BEST_SHOT.GIT_HASH': GIT_HASH,
      }),
    ]);
  };
}

export const name = displayName;

export const schema = {
  define: {
    title: 'Options of DefinePlugin',
    description: 'transform by `JSON.stringify`',
    type: 'object',
  },
};
