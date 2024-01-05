import { createRequire } from 'node:module';

const Require = createRequire(import.meta.url);

const pkg = Require('../package.json');

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
  target: 'node14',
  entry: {
    cli: '@best-shot/cli',
  },
  output: {
    path: 'dist',
    module: true,
  },
  externals,
};
