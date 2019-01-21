# @best-shot/preset-style

Best-shot preset for stylesheet.

[url]: https://www.npmjs.com/package/@best-shot/preset-style

[![npm version](https://img.shields.io/npm/v/@best-shot/preset-style.svg?style=flat-square&logo=npm)][url]
![node](https://img.shields.io/node/v/@best-shot/preset-style.svg?style=flat-square&colorB=green)
![license](https://img.shields.io/npm/l/@best-shot/preset-style.svg?style=flat-square&colorB=blue)

This preset includes the following packages:

- style-loader / css-loader
- less-loader / sass-loader
- postcss-loader / autoprefixer
- extract-css-chunks-webpack-plugin
- optimize-cssnano-plugin
- imagemin-webpack-plugin

## Install

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

```bash
best-shot <command> [options]
```
