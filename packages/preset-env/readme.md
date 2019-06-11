# @best-shot/preset-env

A `best-shot` preset for env variables.

[npm-url]: https://www.npmjs.com/package/@best-shot/preset-env
[npm-badge]: https://img.shields.io/npm/v/@best-shot/preset-env.svg?style=flat-square&logo=npm
[github-url]: https://github.com/Airkro/best-shot/tree/master/packages/preset-env
[node-badge]: https://img.shields.io/node/v/@best-shot/preset-env.svg?style=flat-square&colorB=green&logo=node.js
[license-badge]: https://img.shields.io/npm/l/@best-shot/preset-env.svg?style=flat-square&colorB=blue&logo=github

[![npm][npm-badge]][npm-url]
[![license][license-badge]][github-url]
![node][node-badge]

The package will select the configuration file from `process.cwd()` according to the following priority.

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

```yaml
# example: .best-shot/env.yaml
production:
  SERVICE_URL: http://sample.org/api
  APPID: 123456789

development:
  SERVICE_URL: http://sample.dev/api
  APPID: 987654321

serve:
  SERVICE_URL: http://mock.dev/api
```

```toml
# example: .best-shot/env.toml
[production]
SERVICE_URL = "http://sample.org/api"
APPID = 123456789

[development]
SERVICE_URL = "http://sample.dev/api"
APPID = 987654321

[serve]
SERVICE_URL = "http://mock.dev/api"
```

```js
// output: production mode
module.exports = {
  new DefinePlugin({
    WHATEVER: '"abc"',
    SERVICE_URL: '"http://sample.org/api"',
    APPID: '123456789'
  })
};

// output: development mode
module.exports = {
  new DefinePlugin({
    WHATEVER: '"abc"',
    SERVICE_URL: '"http://sample.dev/api"',
    APPID: '987654321'
  })
};
```

## Tips

Variables with the same name as the Node.js built-in module will be removed.
