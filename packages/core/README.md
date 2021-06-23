# @best-shot/core <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

Create 'best-shot' config chain.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/core
[npm-badge]: https://img.shields.io/npm/v/@best-shot/core.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/core
[github-badge]: https://img.shields.io/npm/l/@best-shot/core.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/core.svg?style=flat-square&colorB=green&logo=node.js

This tool includes the following packages:

- case-sensitive-paths-webpack-plugin
- clean-webpack-plugin
- copy-webpack
- terser-webpack-plugin
- webpack-chain

## Installation

```bash
npm install @best-shot/core --save-dev
```

## Usage

```mjs
import BestShot from '@best-shot/core';

new BestShot({ presets: ['babel'] }).load({
  mode: 'production',
  config: {
    polyfill: 'usage'
  }
});

new BestShot({ presets: ['style'] }).load({
  mode: 'development',
  watch: true
});
```

## Inspiration

This project is inspired by [neutrinojs](https://neutrinojs.org/).
