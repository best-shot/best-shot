# @best-shot/preset-style

A `best-shot` preset for stylesheets.

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset offer the following features:

- CSS Modules
- `less` / `sass` syntax
- Use `autoprefixer` by default
- `imagemin` and `cssnano` support

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

### CSS Modules support

Use `[name].module.[extname]` as filename. [Learn more](https://github.com/css-modules/css-modules)

```js
// example.js
import foo from './foo.module.css';
import bar from './bar.module.scss';
```

Use CSS Modules in Vue.js. [Learn more](https://vue-loader.vuejs.org/guide/css-modules.html)

```vue
<!-- example.vue -->
<style lang="css" module></style>
<style lang="scss" module></style>
<style lang="less" module></style>
```

## Tips

### Load custom `postcss` config

Disable internal `autoprefixer` first.

```js
// example: .best-shot/config.js
module.exports = {
  webpackChain(config) {
    config.module
      .rule('style')
      .rule('postcss')
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

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-style
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-style.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-style
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-style.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-style.svg?style=flat-square&colorB=blue&logo=github
