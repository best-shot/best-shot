# @best-shot/preset-react

A `best-shot` preset for react project.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-react
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-react.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-react
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-react.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-react.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

This preset offer the following features:

- [React](https://reactjs.org/) framework and jsx syntax support.
- Use [react-hot-loader](https://github.com/gaearon/react-hot-loader) to support hot module reload.
- Remove react propTypes in `production` mode.

## Installation

```bash
npm install @best-shot/preset-react --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: [..., 'babel', 'react'],
  ...
};
```
