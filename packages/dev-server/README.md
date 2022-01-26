# @best-shot/dev-server <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

DevServer support of `@best-shot/cli`.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/dev-server
[npm-badge]: https://img.shields.io/npm/v/@best-shot/dev-server.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/dev-server
[github-badge]: https://img.shields.io/npm/l/@best-shot/dev-server.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/dev-server.svg?style=flat-square&colorB=green&logo=node.js

## Features

- All Features of [webpack-dev-server@4](https://webpack.js.org/configuration/dev-server/)
- Hook `historyApiFallback` into `publicPath`
- Show a wait page when bundling
- Provide a 404 error page
- Open source file in vscode (from vue-devtools)

## Installation

```bash
npm install @best-shot/cli @best-shot/dev-server --save-dev
```

## Usage

```bash
npx --no-install best-shot serve [options]
```

```mjs
// example: .best-shot/config.mjs
export default {
  experiments: {
    lazyCompilation: false // true by default
  },
  devServer: {
    // without this will fallback to `watch` mode
  }
};
```

## Tips

### Difference with webpack-dev-server

- `options.static` is `false` by default.
- `options.hot` is `only` by default.

## Related

- [@best-shot/cli](../cli)
