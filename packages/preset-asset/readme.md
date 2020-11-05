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

- import `jpg` `jpeg` `png` `gif` `svg`
- import `woff` `woff2` `otf` `eot` `ttf`
- Use `imagemin` in production mode

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

### Installing troubleshooting

In China mainland, use [bin-wrapper-china](https://github.com/best-shot/bin-wrapper-china) might help.

You also can replace `gifsicle/jpegtran-bin/optipng-bin` by using [yarn resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions), `best-shot` will disable them automatically.

```json
// package.json
{
  "resolutions": {
    "bin-wrapper": "npm:bin-wrapper-china",
    "gifsicle": "npm:some-empty-package"
  }
}
```
