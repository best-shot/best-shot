# @best-shot/preset-babel

A `best-shot` preset for babel compiler.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-babel
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-babel
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset can transform:

- ECMAScript 2019 syntax
- Class static properties
- Decorators
- Dynamic Import
- Numeric Separator

## Installation

```bash
npm install @best-shot/preset-babel --save-dev
```

Then specify `core-js@3` as a top level dependency.

```bash
npm install core-js@3 --save
```

## Usage

```js
// example: best-shot.config.js
module.exports = {
  presets: [..., 'babel'],
  polyfill: 'usage',
  ...
};
```

## Options

### polyfill

- enum: [ false, 'entry', 'usage' ]
- default: false

Same as [options.useBuiltIns](https://babeljs.io/docs/en/next/babel-preset-env#usebuiltins) of `@babel/preset-env`.
