import defineConfig from '@nice-move/syncpack-config';

// @ts-check

export default defineConfig(import.meta.url, {
  semverGroups: [
    {
      dependencies: ['@best-shot/vue-loader'],
      range: '',
    },
  ],
  versionGroups: [
    {
      dependencies: ['node'],
      dependencyTypes: ['engines'],
      label: 'Pin engines.node',
      packages: ['@best-shot/no-cache-loader'],
      pinVersion: '>=12.0.0',
    },
    {
      dependencies: ['@best-shot/webpack-chain', '@best-shot/vue-loader'],
      dependencyTypes: ['!local'],
      label: 'Pin others',
      preferVersion: 'highestSemver',
    },
    {
      dependencies: ['@best-shot/*'],
      dependencyTypes: ['!local'],
      label: 'Pin pnpm workspace',
      pinVersion: 'workspace:^',
    },
  ],
});
