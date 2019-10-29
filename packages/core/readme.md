# @best-shot/core

Create 'best-shot' config chain.

[npm-url]: https://www.npmjs.com/package/@best-shot/core
[npm-badge]: https://img.shields.io/npm/v/@best-shot/core.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/core
[node-badge]: https://img.shields.io/node/v/@best-shot/core.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/core.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This tool includes the following packages:

- case-sensitive-paths-webpack-plugin
- clean-webpack-plugin
- copy-webpack-plugin
- terser-webpack-plugin
- webpack-chain

## Installation

```bash
npm install @best-shot/core --save-dev
```

## Usage

```js
const BestShot = require('@best-shot/core');

new BestShot({ presets: ['babel'] }).load({ mode: 'production' });
```
