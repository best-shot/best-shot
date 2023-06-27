function variables(object) {
  return Object.fromEntries(
    Object.entries(object)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => [key, JSON.stringify(value)]),
  );
}

function prefix(object) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [
      `import.meta.env.${key}`,
      value,
    ]),
  );
}

const displayName = 'define';

export function apply({ config: { define } }) {
  return async (chain) => {
    const mode = chain.get('mode');
    const watch = chain.get('watch');
    const name = chain.get('name');

    const {
      default: { DefinePlugin },
    } = await import('webpack');

    chain.plugin(displayName).use(DefinePlugin, [
      variables({
        ...define,
        ...prefix({
          PROD: mode === 'production',
          DEV: mode === 'development',
          MODE: mode,
          WATCHING: watch,
          CONFIG_NAME: name,
        }),
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
