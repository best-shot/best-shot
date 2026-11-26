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

This preset uses webpack's built-in HTML module support. Point your entries at real HTML files; webpack resolves their `<script>` and `<link>` tags into chunks and assets.

## Installation

```bash
npm install @best-shot/preset-web --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export const config = {
  presets: ['web'],
  entry: './src/index.html'
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
  entry: {
    // Multiple Page Application: one HTML file per entry.
    // Output files keep the HTML basename: index.html, page.html, ...
    index: './src/index.html',
    page: './src/page.html'
  }
};
```

## Tips

### Polyfill

This preset use `global` as `options.babel.polyfill`.

See Options in [@best-shot/preset-babel](../preset-babel#polyfill)

## Related

- [@best-shot/preset-style](../preset-style)
- [@best-shot/core](../core)
