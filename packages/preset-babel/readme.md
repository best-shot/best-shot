# @best-shot/preset-babel

A `best-shot` preset for babel compiler.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-babel
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-babel
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green&logo=node.js

This preset uses [babel-preset-evergreen] by default. It can transform:

- ECMAScript 2021 syntax
- Class static properties
- Decorators

## Installation

```bash
npm install @best-shot/preset-babel --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['babel'],
  polyfill: 'global'
};
```

## Options

### polyfill

- type: [ false, 'global', 'pure' ]
- default: false

How `babel` handles polyfills. `pure` is an experimental option.

References: <https://github.com/babel/babel/issues/10008>

Install `core-js@3` as a top-level dependency when specifying 'global' or 'pure'.

```bash
npm install core-js@3 --save
```

## Create custom babel configuration

References: <https://babeljs.io/docs/en/configuration>

```json
// example: babel.config.json
{
  "plugins": ["lodash", "macros"]
}
```

### Decorators support

To avoid risks, you have to enable `proposal-decorators` manually.

Read more: <https://babeljs.io/docs/en/babel-plugin-proposal-decorators>

```json
// example: babel.config.json
{
  "plugins": ["@babel/proposal-decorators"]
}
```
