# @best-shot/preset-style <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

A `best-shot` preset for stylesheet.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-style
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-style.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-style
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-style.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-style.svg?style=flat-square&colorB=green&logo=node.js

This preset offer the following features:

- [CSS Modules] support
- [Less] / [Sass] syntax support
- [PostCSS] v7 support
- Use [postcss-preset-evergreen] by default
- Use [cssnano] in production mode

[css modules]: https://github.com/css-modules/css-modules
[cssnano]: https://cssnano.co/
[sass]: https://sass-lang.com/
[less]: http://lesscss.org/
[postcss]: https://github.com/postcss/postcss
[postcss-preset-evergreen]: https://github.com/best-shot/postcss-preset-evergreen

## Installation

```bash
npm install @best-shot/preset-style --save-dev
```

## Usage

```cjs
// example: .best-shot/config.cjs
module.exports = {
  presets: ['style']
};
```

### CSS Modules support

Use `[name].module.[extname]` as filename.

```js
import { foo } from './foo.module.css';
import { bar } from './bar.module.scss';
```

Use CSS Modules in Vue.js. [Learn more](https://vue-loader.vuejs.org/guide/css-modules.html)

<!-- eslint-skip -->

```vue
<!-- example.vue -->
<style lang="css" module></style>
<style lang="scss" module></style>
<style lang="less" module></style>
```

## Tips

### Load custom `postcss` config

Disable internal options:

```cjs
// example: .best-shot/config.cjs
module.exports = {
  webpackChain(config) {
    config.module
      .rule('style')
      .rule('postcss')
      .use('postcss-loader')
      .tap((options) => ({
        ...options,
        postcssOptions: {}
      }));
  }
};
```

Write your config in any way. See <https://github.com/postcss/postcss-load-config>

```cjs
// example: postcss.config.cjs
module.exports = {
  plugins: {
    'postcss-preset-env': {}
  }
};
```
