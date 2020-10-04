# @best-shot/preset-react

A `best-shot` preset for react project.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-react
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-react.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/preset-react
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-react.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-react.svg?style=flat-square&colorB=green&logo=node.js

This preset offer the following features:

- [React](https://reactjs.org/) framework and JSX syntax support.
- Use [react-hot-loader](https://github.com/gaearon/react-hot-loader) to support hot module reload.
- Remove react/airbnb propTypes in `production` mode.

## Installation

```bash
npm install @best-shot/preset-react --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['babel', 'react']
};
```

## Tips

This preset contains some optimization transform.
It is not 100% safe, you can enable them manually.

```json
// example: babel.config.json
{
  "plugins": ["@babel/transform-react-constant-elements"],
  "env": {
    "production": {
      "plugins": ["@babel/transform-react-inline-elements"]
    }
  }
}
```
