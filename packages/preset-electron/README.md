# @best-shot/preset-electron <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

A `best-shot` preset for `electron` project.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-electron
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-electron.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-electron
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-electron.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-electron.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install @best-shot/preset-electron --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export default [
  {
    name: 'main',
    presets: ['electron'],
    target: 'electron-main'
  },
  {
    name: 'renderer',
    presets: ['electron'],
    target: 'electron-renderer'
  }
];
```
