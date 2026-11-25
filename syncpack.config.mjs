// @ts-check

import { defineConfig } from '@nice-move/syncpack-config/define.mjs';

const config = defineConfig(import.meta.url, {
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

// syncpack uses the first matching version group. These groups must come
// before the generated catalog groups so the intentional ranges below are
// pinned to themselves instead of being reported as conflicts.
export default {
  ...config,
  versionGroups: [
    // preset-react intentionally supports both React 18 and 19.
    {
      dependencies: ['react', 'react-dom'],
      dependencyTypes: ['peer'],
      packages: ['@best-shot/preset-react'],
      pinVersion: '^18.3.1 || ^19.0.0',
    },
    // inspector and tests keep their existing prettier peer range.
    {
      dependencies: ['prettier'],
      dependencyTypes: ['peer'],
      packages: ['@best-shot/inspector', 'best-shot-test'],
      pinVersion: '~3.9.6',
    },
    ...config.versionGroups,
  ],
};
