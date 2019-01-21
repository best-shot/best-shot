# @best-shot/preset-react

Best-shot preset for React project.

[url]: https://www.npmjs.com/package/@best-shot/preset-react

[![npm version](https://img.shields.io/npm/v/@best-shot/preset-react.svg?style=flat-square&logo=npm)][url]
![node](https://img.shields.io/node/v/@best-shot/preset-react.svg?style=flat-square&colorB=green)
![license](https://img.shields.io/npm/l/@best-shot/preset-react.svg?style=flat-square&colorB=blue)

This preset includes the following packages:

- @babel/preset-react
- babel-plugin-transform-react-remove-prop-types
- react-hot-loader
- @hot-loader/react-dom

## Install

```bash
npm install best-shot @best-shot/preset-react --save-dev
```

## Usage

```js
// best-shot.config.js
module.exports = {
  presets: [..., 'react'],
  ...
};
```

```bash
best-shot <command> [options]
```
