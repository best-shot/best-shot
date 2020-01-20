# @best-shot/preset-babel

A `best-shot` preset for babel compiler.

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset can transform:

- ECMAScript 2020 syntax
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
  presets: [..., 'babel'],
  polyfill: 'usage',
  ...
};
```

## Options

### polyfill

- type: [ false, 'usage', 'pure' ]
- default: false

How `babel` handles polyfills. `pure` is an experimental option.

References: <https://github.com/babel/babel/issues/10008>

Install `core-js@3` as a top-level dependency when specifying 'usage' or 'pure'.

```bash
npm install core-js@3 --save
```

## Tips

Create custom babel configuration.

References: <https://babeljs.io/docs/en/configuration>

```json
// babel.config.json
{
  "plugins": ["lodash", "macros"]
}
```

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-babel
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-babel
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue&logo=github
