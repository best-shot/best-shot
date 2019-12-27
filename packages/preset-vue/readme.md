# @best-shot/preset-vue

A `best-shot` preset for Vue project.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-vue
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-vue.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-vue
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-vue.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-vue.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

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
  presets: [..., 'vue'],
  ...
};
```

## Tips

### Add `JSX` support

Use `@vue/babel-preset-jsx` ( [github](https://github.com/vuejs/jsx) | [npm](https://www.npmjs.com/package/@vue/babel-preset-jsx) )

```bash
npm install @vue/babel-preset-jsx --save-dev
```

```js
// example: .best-shot/config.js
module.exports = {
  // install @best-shot/preset-babel
  presets: [..., 'babel', 'vue'],
  ...
};

// example: babel.config.js
module.exports = {
  presets: [..., '@vue/jsx'],
  ...
};
```

### Whitespace options override

Options `compilerOptions.whitespace` of `vue-loader` is set to `condense` by default.

See: <https://github.com/vuejs/vue/tree/dev/packages/vue-template-compiler#options>
