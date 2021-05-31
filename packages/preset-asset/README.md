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

- import `jpg` / `jpeg` / `png` / `gif` / `svg`
- import `woff` / `woff2` / `otf` / `eot` / `ttf`
- Use `imagemin` in production mode (disable until the error fixed)
- export `yml` / `yaml` / `txt` / `json` to standalone file

## Installation

```bash
npm install @best-shot/preset-asset --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['asset']
};
```

## Tips

### Standalone data file output

For `yml` / `yaml` / `txt` / `json` format:

```js
import('./sample.json');
// { foo: 'bar' }

import('./sample.[hash].json');
// sample.xxxxxxxx.json
```

### The `mutable` resourceQuery for image

Generate mutable resources filename:

```js
import('./avatar/male.png?mutable');
// image/avatar/male.png

import('./header/header-bg.png');
// image/header-bg.min.xxxxxxxx.png
```

### Preprocess non-ascii character

```plain
天地人-abc.jpg -> 4273f2f7-abc.jpg
```

### Installing troubleshooting

In China mainland, use [bin-wrapper-china](https://github.com/best-shot/bin-wrapper-china) might help.

Otherwise, you can replace `gifsicle/jpegtran-bin/optipng-bin` with any empty package by using [yarn resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions), `best-shot` will disable them automatically.

```jsonc
// package.json
{
  "resolutions": {
    "bin-wrapper": "npm:bin-wrapper-china",
    "gifsicle": "npm:some-empty-package"
  }
}
```
