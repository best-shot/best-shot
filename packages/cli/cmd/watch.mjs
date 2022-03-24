export const command = 'watch';

export const describe = 'Same as `dev` command in watch mode';

export function builder(cli) {
  cli.option('config-name', {
    describe: 'Name for multi config',
    alias: 'n',
    type: 'array',
    coerce: (values = []) =>
      values.length > 0
        ? values
            .map((value) => (value ? value.trim() : undefined))
            .filter(Boolean)
        : undefined,
    requiresArg: true,
  });
}

export function handler(args) {
  import('../lib/action.mjs')
    .then(({ action }) => {
      action(args);
    })
    .catch(console.error);
}
