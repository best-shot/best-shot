// @ts-check

import defineConfig from '@nice-move/syncpack-config/define.cjs';

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
      dependencies: ['slash'],
      packages: ['@best-shot/sfc-split-loader'],
      pinVersion: '^3.0.0',
    },
    {
      dependencies: ['vue'],
      label: 'Pin vue',
      pinVersion: '^3.4.27',
    },
  ],
});
