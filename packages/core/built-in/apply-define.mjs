import { getEnv, getGitHash, pretty, prefix, variables } from '@best-shot/env';

const displayName = 'define';

export function apply({ cwd: root, config: { define = {}, mini } }) {
  const GIT_HASH = getGitHash();

  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const name = chain.get('name');
    const serve = chain.devServer.entries() !== undefined;

    const {
      default: { DefinePlugin },
    } = await import('webpack');

    const { envs } = getEnv({ root, mode, serve, watch, name });

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
            MINI_APP: mini !== undefined,
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
