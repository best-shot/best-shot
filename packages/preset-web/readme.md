# @best-shot/preset-web

A `best-shot` preset for web project.

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
- webpack-subresource-integrity

## Installation

```bash
npm install @best-shot/preset-web --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: [..., 'web'],
  ...
};
```

## Tips

### Polyfill

This preset will change the default value of `options.polyfill` to `usage`.

See Options in [@best-shot/preset-babel](../preset-babel)

### Split Chunks

```js
// example: .best-shot/config.js
module.exports = {
  presets: [..., 'web'],
  vendors: {
    common: ['lodash', 'axios']
  },
  ...
};
```

### Single Page Application

```js
// example: .best-shot/config.js
module.exports = {
  presets: [..., 'web'],
  html: {
    filename: './src/index.html'
  },
  ...
};
```

### Multiple Page Application

```js
// example: .best-shot/config.js
module.exports = {
  presets: [..., 'web'],
  html: [
    {
      filename: './src/index.html',
      title: 'Hello world!'
    },
    {
      filename: './src/intro.html',
      title: 'Hello world!' // same by default
    }
  ],
  ...
};
```
