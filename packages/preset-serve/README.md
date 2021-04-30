# @best-shot/preset-serve <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

A `best-shot` preset for `dev-server` integrated.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-serve
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-serve.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-serve
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-serve.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-serve.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install @best-shot/preset-serve --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['serve'],
  lazyCompilation: false, // true by default
  devServer: {
    // ...
  }
};
```

## Related

- [@best-shot/dev-server](../dev-server)
- [@best-shot/core](../core)
