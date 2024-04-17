'use strict';

// @ts-check

/** @type {import("syncpack").RcFile} */
module.exports = {
  lintFormatting: false,
  customTypes: {
    engines: {
      path: 'engines',
      strategy: 'versionsByName',
    },
  },
  semverGroups: [
    {
      dependencies: ['@best-shot/vue-loader'],
      range: '',
    },
    {
      dependencies: ['**'],
      dependencyTypes: ['!local', '!engines'],
      range: '^',
    },
  ],
  versionGroups: [
    {
      dependencies: ['@types/**'],
      dependencyTypes: ['!dev'],
      isBanned: true,
      label: '@types packages should only be under devDependencies',
    },
    {
      dependencies: ['node'],
      dependencyTypes: ['engines'],
      label: 'Pin engines.node',
      packages: ['!@best-shot/no-cache-loader'],
      pinVersion: '^18.12.0 || >=20.0.0',
    },
    {
      dependencies: ['react', 'react-dom'],
      dependencyTypes: ['!local'],
      label: 'Pin react',
      policy: 'sameRange',
    },
    {
      dependencies: [
        '@best-shot/webpack-chain',
        '@best-shot/vue-loader',
        '!@best-shot/*',
      ],
      dependencyTypes: ['!local'],
      label: 'Pin others',
      preferVersion: 'highestSemver',
    },
    {
      dependencies: [
        '@best-shot/*',
        '!@best-shot/webpack-chain',
        '!@best-shot/vue-loader',
      ],
      dependencyTypes: ['dev', 'prod', 'peer'],
      label: 'Pin pnpm workspace',
      pinVersion: 'workspace:^',
    },
  ],
};
