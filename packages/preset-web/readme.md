# @best-shot/preset-web

Best-shot preset for web project.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-web
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-web.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-web
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-web.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-web.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset includes the following packages:

- micro-tpl-loader
- html-webpack-plugin
- script-ext-html-webpack-plugin

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

## Tips

This preset will change the default value of `options.polyfill` to `usage`.
