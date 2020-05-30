# @best-shot/preset-env

A `best-shot` preset for env variables.

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

The package will find the configuration from `process.cwd()` according to the following priority:

- ./best-shot/env.toml
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
  presets: [..., 'env'],
  define: {
    WHATEVER: 'abc'
  },
  ...
};
```

```toml
# example: .best-shot/env.toml
[production]
SERVICE_URL = "https://sample.org/api"
APPID = "123456789"

[development]
SERVICE_URL = "http://sample.dev/api"
APPID = "987654321"

[serve]
SERVICE_URL = "http://mock.dev/api"
```

```js
// output: production mode
module.exports = {
  new DefinePlugin({
    APPID: '"123456789"',
    SERVICE_URL: '"https://sample.org/api"',
    WHATEVER: '"abc"'
  })
};

// output: development mode
module.exports = {
  new DefinePlugin({
    APPID: '"987654321"',
    SERVICE_URL: '"http://sample.dev/api"',
    WHATEVER: '"abc"',
  })
};

// output: serve command
module.exports = {
  new DefinePlugin({
    APPID: '"987654321"',
    SERVICE_URL: '"http://mock.dev/api"',
    WHATEVER: '"abc"',
  })
};
```

## Tips

### Namespace safety

Don't use built-in module name like:

```toml
__dirname = 123456
console = "xyz"
```

### Git info inject

If a `process.cwd()` is a git repository, `GIT_BRANCH`, `GIT_HASH` will be injected to your config too.

```js
module.exports = {
  new DefinePlugin({
    GIT_BRANCH: '"master"',
    GIT_HASH: '"66ed46c"'
  })
};
```

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-env
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-env.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-env
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-env.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-env.svg?style=flat-square&colorB=blue&logo=github
