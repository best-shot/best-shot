const { readFileSync } = require('fs');
const { resolve } = require('path');

const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const suffix = require('suffix');
const { parse } = require('@iarna/toml');
// @ts-ignore
const { cyan } = require('chalk');
// eslint-disable-next-line import/no-extraneous-dependencies
const { DefinePlugin } = require('webpack');

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

const mainPath = 'best-shot.env.toml';
const localPAth = suffix(mainPath, '.local');

exports.name = 'preset-env';

exports.apply = function apply({
  inject = false,
  mode = 'development',
  options: { serve = false, watch = false },
  rootPath
}) {
  const mainEnv = parser(resolve(rootPath, mainPath), mainPath);
  const localEnv = parser(resolve(rootPath, localPAth), localPAth);

  const {
    mode: byMode, serve: byServe, watch: byWatch, basic
  } = {
    mode: { ...mainEnv[mode], ...localEnv[mode] },
    serve: { ...mainEnv.serve, ...localEnv.serve },
    watch: { ...mainEnv.watch, ...localEnv.watch },
    basic: { ...mainEnv.basic, ...localEnv.basic }
  };

  const data = {
    ...basic,
    ...byMode,
    ...(watch || serve ? byWatch : {}),
    ...(serve ? byServe : {})
  };

  const result = inject
    ? mapKeys(data, (value, key) => `process.env.${key}`)
    : data;

  console.log(cyan`PRESET-ENV`, pretty(result));

  return chain => {
    if (inject) {
      chain
        .plugin('environment')
        .tap(([options]) => [{ ...options, ...result }]);
    } else {
      const io = mapValues(result, JSON.stringify);

      if (chain.plugins.has('define')) {
        chain.plugin('define').tap(([options]) => [{ ...options, ...io }]);
      } else {
        chain.plugin('define2').use(DefinePlugin, [io]);
      }
    }
  };
};
