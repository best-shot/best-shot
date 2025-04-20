// @ts-check

import { defineConfig } from '@nice-move/syncpack-config/define.mjs';

export default defineConfig(import.meta.url, {
  semverGroups: [
    {
      dependencies: ['@best-shot/vue-loader'],
      range: '',
    },
    {
      dependencies: ['webpack-dev-server'],
      range: '~',
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
  ],
});
