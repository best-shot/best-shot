# @best-shot/preset-asset <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

A `best-shot` preset for asset.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-asset
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-asset.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-asset
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-asset.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-asset.svg?style=flat-square&colorB=green&logo=node.js

This preset offer the following features:

- bundle `jpg` / `jpeg` / `png` / `gif` / `svg`
- bundle `woff` / `woff2` / `otf` / `eot` / `ttf`
- image minify in production mode

## Installation

```bash
npm install @best-shot/preset-asset --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export const config = {
  presets: ['asset']
};
```

## Tips

### The `mutable` resourceQuery for image

Generate mutable resources filename:

```js
// image/avatar/male.png
import img1 from './avatar/male.png?mutable' with { type: 'mutable' };

// image/header-bg.min.xxxxxxxx.png
import img2 from './header/header-bg.png';
```

### Preprocess non-ascii character

```plain
天地人-abc.jpg -> 4273f2f7-abc.jpg
```

## Related

- [@best-shot/preset-style](../preset-style)
- [@best-shot/preset-web](../preset-web)
- [@best-shot/core](../core)
