// @ts-check

import defineConfig from '@nice-move/syncpack-config/define.cjs';

export default defineConfig(import.meta.url, {
  semverGroups: [
    {
      dependencies: ['@best-shot/vue-loader', 'webpack-dev-server'],
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
      packages: ['@best-shot/sfc-split-plugin'],
      dependencies: ['slash'],
      pinVersion: '^3.0.0',
    },
  ],
});
