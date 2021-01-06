const mapValues = require('lodash/mapValues');
const sortKeys = require('sort-keys');

const { findConfig, parseConfig, filterData } = require('./lib.cjs');

const envFile = findConfig(process.cwd());

const { production, development, watch, serve, ...rest } = parseConfig(envFile);

const envObject = mapValues(
  filterData({
    ...rest,
    ...production,
    ...development,
    ...watch,
    ...serve,
  }),
  () => 'readonly',
);

const globals = sortKeys({
  ...envObject,
  BEST_SHOT: 'readonly',
});

module.exports = { globals };
