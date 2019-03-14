# @best-shot/preset-babel

Best-shot preset for Babel compiler.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-babel
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green&logo=node.js

[![npm][npm-badge]][npm-url]
![node][node-badge]
![license](https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue&logo=github)

This preset includes the following packages:

- @babel/core
- @babel/polyfill
- @babel/preset-env
- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-decorators
- @babel/plugin-proposal-export-namespace-from
- @babel/plugin-proposal-numeric-separator
- @babel/plugin-syntax-dynamic-import
- core-js
- regenerator-runtime
- babel-loader

## Installation

```bash
npm install @best-shot/preset-babel --save-dev
```

## Usage

```js
// best-shot.config.js
module.exports = {
  presets: [..., 'babel'],
  ...
};
```
