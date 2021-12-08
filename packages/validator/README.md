# @best-shot/validator <img src="https://cdn.jsdelivr.net/gh/best-shot/best-shot/packages/validator/logo.svg" alt="logo" height="80" align="right">

Config validator of 'best-shot'.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@best-shot/validator
[npm-badge]: https://img.shields.io/npm/v/@best-shot/validator.svg?style=flat-square&logo=npm
[github-url]: https://github.com/best-shot/best-shot/tree/master/packages/validator
[github-badge]: https://img.shields.io/npm/l/@best-shot/validator.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@best-shot/validator.svg?style=flat-square&colorB=green&logo=node.js

## Schema

- JSON Schema draft-07
- formats: `regex`
- keywords: `instanceof/transform/uniqueItemProperties`

## Installation

```bash
npm install @best-shot/validator --save-dev
```

## Usage

```mjs
import { validate } from '@best-shot/validator';

validate({ data, schema })
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.warn(error.detail);
  });
```

## Related

- [@best-shot/core](../core)
- [@best-shot/cli](../cli)
