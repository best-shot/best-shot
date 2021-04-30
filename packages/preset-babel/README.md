# @best-shot/preset-babel

A `best-shot` preset for babel compiler.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[babel-preset-evergreen]: https://github.com/best-shot/babel-preset-evergreen
[npm-url]: https://www.npmjs.com/package/@best-shot/preset-babel
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-babel.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-babel
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-babel.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-babel.svg?style=flat-square&colorB=green&logo=node.js

This preset uses [babel-preset-evergreen] by default. It can transform:

- ECMAScript 2021 syntax
- Class static properties

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

### targets

Can't be specify directly, always using `browserslist.loadConfig() || browserslist.defaults`.

### polyfill

- type: [ false, 'global', 'pure' ]
- default: false

How `babel` handles polyfills. `pure` is an experimental option.

References: <https://github.com/babel/babel/issues/10008>

## Tips

You might need to pin `core-js@3` when your project dependency tree has `core-js@2`:

```sh
npm install core-js@3
```

### Create custom babel configuration

References: <https://babeljs.io/docs/en/configuration>

```json
// example: babel.config.json
{
  "plugins": ["lodash", "macros"]
}
```

## Related

- [@best-shot/preset-react](../preset-react)
- [@best-shot/core](../core)
