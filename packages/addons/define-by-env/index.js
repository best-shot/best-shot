const mapKeys = require('lodash/mapKeys');
// @ts-ignore
const { cyan } = require('chalk');
const { parse } = require('@iarna/toml');
const { readFileSync } = require('fs');
const { join } = require('path');
const suffix = require('suffix');

// eslint-disable-next-line import/no-extraneous-dependencies
const { pretty, logRedError } = require('@best-shot/core/lib/common');

function read(path) {
  try {
    return readFileSync(path);
  } catch (err) {
    return {};
  }
}

function parser(path, name) {
  const data = read(path);
  try {
    const {
      development = {},
      production = {},
      serve = {},
      watch = {},
      ...basic
    } = parse(data);
    return {
      development,
      production,
      serve,
      watch,
      basic
    };
  } catch (err) {
    logRedError(`Parse \`${name}\` fail`, err.message);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}

module.exports = function defineByEnv({
  command,
  mainPath = 'best-shot.env.toml',
  localPAth = suffix(mainPath, '.local'),
  inject = false
}) {
  const resolve = path => join(process.cwd(), path);

  const mainEnv = parser(resolve(mainPath), mainPath);
  const localEnv = parser(resolve(localPAth), localPAth);

  const {
    development, production, serve, watch, basic
  } = {
    development: { ...mainEnv.development, ...localEnv.development },
    production: { ...mainEnv.production, ...localEnv.production },
    serve: { ...mainEnv.serve, ...localEnv.serve },
    watch: { ...mainEnv.watch, ...localEnv.watch },
    basic: { ...mainEnv.basic, ...localEnv.basic }
  };

  const env = {
    ...basic,
    ...(command === 'prod' ? production : development),
    ...(command === 'watch' || command === 'serve' ? watch : {}),
    ...(command === 'serve' ? serve : {})
  };

  const result = inject
    ? mapKeys(env, (value, key) => `process.env.${key}`)
    : env;

  console.log(cyan`DEFINE-BY-ENV:`, command, pretty(result));
  return result;
};
