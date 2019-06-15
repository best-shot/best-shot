'use strict';

const mapValues = require('lodash/mapValues');
const { findConfig, parseConfig, filterData } = require('./lib');

const envFile = findConfig(process.cwd());
const {
  production, development, watch, serve
} = parseConfig(envFile);
const envObject = mapValues(
  {
    ...production,
    ...development,
    ...watch,
    ...serve
  },
  () => true
);
const globals = filterData(envObject);

module.exports = { globals };
