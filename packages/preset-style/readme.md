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
- less / less-loader
- sass / sass-loader
- postcss / postcss-loader / autoprefixer
- extract-css-chunks-webpack-plugin
- optimize-css-assets-webpack-plugin
- imagemin-webpack-plugin

## Installation

```bash
npm install @best-shot/preset-style --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: [..., 'style'],
  ...
};
```

## Tips

### How to load custom `postcss` config

Disable internal `autoprefixer` first.

```js
// example: .best-shot/config.js
module.exports = {
  webpackChain: config => {
    config.module
      .rule('style')
      .use('postcss-loader')
      .tap(options => ({
        ...options,
        plugins: []
      }));
  }
};
```

Write your config in any way. See <https://github.com/michael-ciniawsky/postcss-load-config>

```js
// example: postcss.config.js
module.exports = {
  plugins: {
    'postcss-preset-env': {}
  }
};
```

### Speed up `sass` compile

`@best-shot/preset-style` use `dart-sass` by default. Because `node-sass` has [many issues](https://github.com/webpack-contrib/sass-loader/issues/435). But you still can speed up sass compile by installing `node-sass`.

```bash
npm install node-sass --save-dev
```
