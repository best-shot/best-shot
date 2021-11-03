# @best-shot/preset-vue <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

A `best-shot` preset for Vue project.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-vue
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-vue.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-vue
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-vue.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-vue.svg?style=flat-square&colorB=green&logo=node.js

This preset offer the following features:

- [Vue](https://vuejs.org/) (2.x/3.x) framework support
- Vue [Single-File Component (SFC) Spec](https://vue-loader.vuejs.org/spec.html) support
- Vue 3 [migration build](https://v3.vuejs.org/guide/migration/migration-build.html) support

## Installation

```bash
npm install @best-shot/preset-vue --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export default {
  presets: ['vue'],
  vue: {
    // shadowMode
    // transformAssetUrls
    // compilerOptions
  }
};
```

## Tips

### Vue 3 migration build support

```sh
npm install @vue/compat --save
```

`@vue/compat` will become the alias of `vue` automatically.

```mjs
// example: .best-shot/config.mjs
export default {
  presets: ['vue'],
  vue: {
    compilerOptions: {
      compatConfig: {
        MODE: 2
      }
    }
  }
};
```

### Whitespace options override

`options.compilerOptions.whitespace` of [vue-loader](https://vue-loader.vuejs.org/) is set to `condense` by default.

See: [vue-template-compiler#options](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options)

### Add `CSS/SCSS/LESS` support

```bash
npm install @best-shot/preset-style --save-dev
```

```mjs
// example: .best-shot/config.mjs
export default {
  presets: ['style', 'vue']
};
```

This preset will override `options.asset.esModule` to `false`.

## Related

- [@best-shot/preset-style](../preset-style)
- [@best-shot/preset-web](../preset-web)
- [@best-shot/core](../core)
