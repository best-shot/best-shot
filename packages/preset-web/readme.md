# @best-shot/preset-web

Best-shot preset for web project.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-web
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-web.svg?style=flat-square&logo=npm
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-web.svg?style=flat-square&colorB=green&logo=node.js

[![npm][npm-badge]][npm-url]
![node][node-badge]
![license](https://img.shields.io/npm/l/@best-shot/preset-web.svg?style=flat-square&colorB=blue&logo=github)

This preset includes the following packages:

- html-webpack-plugin
- script-ext-html-webpack-plugin
- micro-tpl-loader

## Installation

```bash
npm install @best-shot/preset-web --save-dev
```

## Usage

```js
// best-shot.config.js
module.exports = {
  presets: [..., 'web'],
  ...
};
```
