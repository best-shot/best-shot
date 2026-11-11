# @best-shot/preset-react <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

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
- Use [react-refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin) to support hot module reload.
- Remove react/airbnb propTypes in `production` mode.
- JSX syntax in typescript: `*.tsx`
- Optional [React Compiler](https://react.dev/learn/react-compiler) support.

## Requirements

Support both React `18.3` and `19`. The [automatic JSX runtime](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) is used by default.

## Installation

```bash
npm install @best-shot/preset-react --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export const config = {
  presets: ['babel', 'react']
};
```

## React Compiler

Opt-in via config:

```mjs
// example: .best-shot/config.mjs
export const config = {
  presets: ['babel', 'react'],
  react: {
    compiler: true,
  },
};
```

The compile target is selected automatically,
React `18` project should also install [react-compiler-runtime](https://www.npmjs.com/package/react-compiler-runtime).

## Tips

`@babel/transform-react-constant-elements` is applied by default.

`@babel/transform-react-inline-elements` is applied only for React `18`,
it produces invalid React elements under React `19`.
It is not 100% safe, you can enable it manually in React `18` project.

```jsonc
// example: babel.config.json
{
  "plugins": ["@babel/transform-react-inline-elements"]
}
```

## Related

- [@best-shot/preset-babel](../preset-babel)
- [@best-shot/core](../core)
