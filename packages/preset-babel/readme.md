# @best-shot/preset-babel

Best-shot preset for Babel compiler.

[url]: https://www.npmjs.com/package/@best-shot/preset-babel

[![npm version](https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm)][url]
![node](https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green)
![license](https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue)

This preset includes the following packages:

- @babel/core
- @babel/preset-env
- @babel/polyfill
- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-decorators
- @babel/plugin-proposal-export-namespace-from
- @babel/plugin-proposal-numeric-separator
- @babel/plugin-syntax-dynamic-import
- core-js
- regenerator-runtime
- babel-loader

## Install

```bash
npm install @best-shot/cli @best-shot/preset-babel --save-dev
```

## Usage

```js
// best-shot.config.js
module.exports = {
  presets: [..., 'babel'],
  ...
};
```

```bash
best-shot <command> [options]
```
