# @best-shot/preset-web

A `best-shot` preset for web project.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-web
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-web.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-web
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-web.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-web.svg?style=flat-square&colorB=green&logo=node.js

This preset includes the following packages:

- micro-tpl-loader
- html-webpack-plugin
- webpack-subresource-integrity
- raw-loader / yaml-loader

## Installation

```bash
npm install @best-shot/preset-web --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['web']
};
```

## Tips

### Polyfill

This preset use `global` as `options.polyfill`.

See Options in [@best-shot/preset-babel](../preset-babel)

### Subresource Integrity

Subresource Integrity (SRI) is enable by default.

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['web'],
  sri: false // To disable it
};
```

### Split Chunks

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['web'],
  vendors: {
    common: ['lodash', 'axios']
  }
};
```

### Multiple Page Application

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['web'],
  html: [
    {
      filename: './src/index.html', // default
      title: 'Hello world!'
    },
    {
      filename: './src/intro.html'
    }
  ]
};
```
