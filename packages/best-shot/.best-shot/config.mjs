import { createRequire } from 'module';

const Require = createRequire(import.meta.url);

const pkg = Require('../package.json');

const externals = [
  /^webpack\//,
  Object.fromEntries(
    Object.keys(pkg.dependencies).map((item) => [
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
