# Env variables

The Cli will find the configuration from `process.cwd()` according to the following priority:

- ./best-shot/env.toml
- ./best-shot/env.ini
- ./best-shot/env.yaml
- ./best-shot/env.json

Then parse your env variable with `JSON.stringify` and pass it to `config.define`.

## Installation

```bash
npm install @best-shot/cli --save-dev
```

## Usage

```mjs
// example: .best-shot/config.mjs
export default {
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

```mjs
// output: production mode
export const production = {
  APPID: '"123456789"',
  SERVICE_URL: '"https://sample.org/"',
  WHATEVER: '"abc"'
};

// output: development mode
export const development = {
  APPID: '"987654321"',
  SERVICE_URL: '"http://sample.dev/"',
  WHATEVER: '"abc"'
};

// output: serve command
export const serve = {
  APPID: '"987654321"',
  SERVICE_URL: '"http://mock.dev/"',
  WHATEVER: '"abc"'
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

```mjs
const config = {
  define: {
    'BEST_SHOT.GIT_HASH': '"xxxxxxxxxxxxxxxxxxxx"'
  }
};
```
