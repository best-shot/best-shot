'use strict';

const { resolve } = require('path');

exports.notEmpty = function notEmpty(object) {
  return object && Object.values(object).some((item) => item !== undefined);
};

const cwd = process.cwd();

exports.cachePath = function cachePath(...args) {
  return resolve(cwd, 'node_modules/.cache/best-shot', ...args);
};
