'use strict';

const mapValues = require('lodash/mapValues');
const isGit = require('is-git-repository');
const sortKeys = require('sort-keys');

const { findConfig, parseConfig, filterData } = require('./lib');

const envFile = findConfig(process.cwd());

const { production, development, watch, serve } = parseConfig(envFile);

const envObject = mapValues(
  filterData({
    ...production,
    ...development,
    ...watch,
    ...serve
  }),
  () => 'readonly'
);

const globals = sortKeys({
  ...envObject,
  ...(isGit()
    ? {
      GIT_HASH: 'readonly',
      GIT_BRANCH: 'readonly'
    }
    : undefined)
});

module.exports = { globals };
