import { getEnv, getGitHash, pretty } from '@best-shot/env';

function variables(object) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => [
        key,
        typeof value === 'object' ? variables(value) : JSON.stringify(value),
      ]),
  );
}

function prefix(object) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      ['import.meta.env', key].filter(Boolean).join('.'),
      value,
    ]),
  );
}

const displayName = 'define';

export function apply({ cwd: root, config: { define = {} } }) {
  const GIT_HASH = getGitHash();

  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const name = chain.get('name');
    const serve = chain.devServer.entries() !== undefined;

    const {
      default: { DefinePlugin },
    } = await import('webpack');

    const { envs } = getEnv({ root, mode, serve, watch });

    pretty(envs);

    chain.plugin(displayName).use(DefinePlugin, [
      {
        ...variables(define),
        'import.meta.env': variables(envs),
        ...variables(
          prefix({
            PROD: mode === 'production',
            DEV: mode === 'development',
            MODE: mode,
            WATCHING: watch,
            CONFIG_NAME: name,
            GIT_HASH,
          }),
        ),
      },
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
