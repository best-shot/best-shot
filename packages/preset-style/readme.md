# @best-shot/preset-style

A `best-shot` preset for stylesheet.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-style
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-style.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-style
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-style.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-style.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset includes the following packages:

- style-loader
- css-loader
- less-loader
- sass-loader
- postcss-loader
- autoprefixer
- extract-css-chunks-webpack-plugin
- optimize-cssnano-plugin
- imagemin-webpack-plugin

## Installation

```bash
npm install @best-shot/preset-style --save-dev
```

## Usage

```js
// best-shot.config.js
module.exports = {
  presets: [..., 'style'],
  ...
};
```
