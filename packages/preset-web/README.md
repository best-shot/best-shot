# @best-shot/preset-web <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

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
- html-add-asset-webpack-plugin
- html-minimizer-webpack-plugin
- webpack-subresource-integrity

## Installation

```bash
npm install @best-shot/preset-web --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export const config = {
  presets: ['web'],
  html: {
    // See: https://github.com/jantimon/html-webpack-plugin#options
  }
};
```

## Options

```mjs
// example: .best-shot/config.mjs
export const config = {
  presets: ['web'],
  vendors: {
    // Split Chunks
    common: ['lodash', 'axios']
  },
  html: [
    // Multiple Page Application
    {
      filename: './src/index.html',
      title: 'Hello world!'
    },
    {
      filename: './src/intro.html'
    }
  ]
};
```

## Tips

### Polyfill

This preset use `global` as `options.babel.polyfill`.

See Options in [@best-shot/preset-babel](../preset-babel#polyfill)

## Related

- [@best-shot/preset-style](../preset-style)
- [@best-shot/core](../core)
