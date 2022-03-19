export const config = {
  target: 'node14',
  entry: {
    cli: './packages/cli/bin/index.mjs',
  },
  output: {
    filename: '[name].mjs',
    path: './packages/best-shot/dist',
    module: true,
  },
};
