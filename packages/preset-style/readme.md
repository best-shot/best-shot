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
- less
- less-loader
- sass
- sass-loader
- postcss-loader
- extract-css-chunks-webpack-plugin
- optimize-cssnano-plugin
- imagemin-webpack-plugin

## Installation

```bash
npm install @best-shot/preset-style --save-dev
```

## Usage

```js
// example: best-shot.config.js
module.exports = {
  presets: [..., 'style'],
  ...
};
```

## Tips

### How to load postcss config

See <https://github.com/michael-ciniawsky/postcss-load-config>

```js
// example: postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {}
  }
};
```

### Use `node-sass` instead `dart-sass`

`@best-shot/preset-style` use `dart-sass` by default. Because `node-sass` has [many issues](https://github.com/webpack-contrib/sass-loader/issues/435).

You can speed up sass compile by installing `node-sass`.

```bash
npm install node-sass --save-dev
```
