import pkg from '../package.json' with { type: 'json' };

const externals = [
  /^webpack\//,
  Object.fromEntries(
    [
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.peerDependencies),
    ].map((item) => [item, `module ${item}`]),
  ),
  Object.fromEntries(
    ['javascript-stringify', 'loader-utils', 'yaml'].map((item) => [
      item,
      `node-commonjs ${item}`,
    ]),
  ),
];

export const config = {
  target: 'node18',
  entry: {
    cli: './src/cli.mjs',
    create: './src/create.mjs',
  },
  output: {
    path: 'dist',
    module: true,
    library: {
      type: 'module',
    },
  },
  externals,
};
