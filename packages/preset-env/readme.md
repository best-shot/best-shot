# @best-shot/preset-env <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/core/logo.svg" alt="logo" height="80" align="right">

A `best-shot` preset for env variables.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-env
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-env.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/best-shot/tree/master/packages/preset-env
[github-badge]: https://img.shields.io/npm/l/@best-shot/preset-env.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-env.svg?style=flat-square&colorB=green&logo=node.js

The package will find the configuration from `process.cwd()` according to the following priority:

- ./best-shot/env.toml
- ./best-shot/env.ini
- ./best-shot/env.yaml
- ./best-shot/env.json

Then parse your env variable with `JSON.stringify` and pass it to `webpack.DefinePlugin`.

## Installation

```bash
npm install @best-shot/preset-env --save-dev
```

## Usage

```js
// example: .best-shot/config.js
module.exports = {
  presets: ['env'],
  define: {
    WHATEVER: 'abc'
  }
};
```

```ini
# example: .best-shot/env.ini

[production]
SERVICE_URL = "https://sample.org/"
APPID = "123456789"

[development]
SERVICE_URL = "http://sample.dev/"
APPID = "987654321"

[serve]
SERVICE_URL = "http://mock.dev/"
```

```js
// output: production mode
module.exports = {
  plugins: [
    new DefinePlugin({
      APPID: '"123456789"',
      SERVICE_URL: '"https://sample.org/"',
      WHATEVER: '"abc"'
    })
  ]
};

// output: development mode
module.exports = {
  plugins: [
    new DefinePlugin({
      APPID: '"987654321"',
      SERVICE_URL: '"http://sample.dev/"',
      WHATEVER: '"abc"'
    })
  ]
};

// output: serve command
module.exports = {
  plugins: [
    new DefinePlugin({
      APPID: '"987654321"',
      SERVICE_URL: '"http://mock.dev/"',
      WHATEVER: '"abc"'
    })
  ]
};
```

## Tips

### Namespace safety

Don't use built-in module name like:

```ini
__dirname = 123456
console = "xyz"
```

### Git hash inject

If a `process.cwd()` is a git repository, `GIT_HASH` will be injected to your config too.

```js
module.exports = {
  plugins: [
    new DefinePlugin({
      GIT_HASH: '"xxxxxxxxxxxxxxxxxxxx"'
    })
  ]
};
```
