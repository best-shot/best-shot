# @best-shot/core <img src="./logo.svg" alt="best-shot" height="80" align="right">

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

```js
const BestShot = require('@best-shot/core');

const configA = new BestShot({ presets: ['babel'] }).load({
  mode: 'production',
  config: {
    polyfill: 'usage'
  }
});

const configB = new BestShot({ presets: ['style'] }).load({
  mode: 'development',
  options: {
    watch: true
  }
});
```
