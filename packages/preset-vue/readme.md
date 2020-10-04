# @best-shot/preset-vue

A `best-shot` preset for Vue project.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-vue
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-vue.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-vue
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-vue.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-vue.svg?style=flat-square&colorB=green&logo=node.js

This preset includes the following packages:

- vue-loader
- vue-template-compiler

## Installation

```bash
npm install @best-shot/preset-vue --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['vue']
};
```

## Tips

### Whitespace options override

`options.compilerOptions.whitespace` of [vue-loader](https://vue-loader.vuejs.org/) is set to `condense` by default.

See: [vue-template-compiler#options](https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options)

### Add stylesheet support

```bash
npm install @best-shot/preset-style --save-dev
```

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['style', 'vue']
};
```

### Add `JSX` support

```bash
npm install @best-shot/preset-babel --save-dev
```

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['babel', 'vue']
};
```

```bash
npm install @vue/babel-preset-jsx --save-dev
```

```js
// example: babel.config.js
module.exports = {
  presets: ['@vue/jsx']
};
```
