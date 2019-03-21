# @best-shot/preset-babel

Best-shot preset for Babel compiler.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-babel
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-babel
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset includes the following packages:

- @babel/core
- @babel/preset-env
- @babel/plugin-proposal-class-properties
- @babel/plugin-proposal-decorators
- @babel/plugin-proposal-export-namespace-from
- @babel/plugin-proposal-numeric-separator
- @babel/plugin-syntax-dynamic-import
- @babel/plugin-syntax-import-meta
- regenerator-runtime
- babel-loader

## Installation

```bash
npm install @best-shot/preset-babel --save-dev
```

Then specify core-js@3 as a top level dependency.

```bash
npm install core-js@3 --save
```

## Usage

```js
// best-shot.config.js
module.exports = {
  presets: [..., 'babel'],
  polyfill: 'usage'
  ...
};
```

## Options

### polyfill

Same as [options.useBuiltIns](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) of `@babel/preset-env`.
