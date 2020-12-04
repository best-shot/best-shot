#!/usr/bin/env node

require('v8-compile-cache');

const { cyan, red } = require('chalk');
const isInstalledGlobally = require('is-installed-globally');
const importLocal = require('import-local');

const { name } = require('../package.json');

if (isInstalledGlobally) {
  console.log(red('Error:'), `'${name}' shouldn't be installed globally`);
  process.exitCode = 1;
} else if (importLocal(__filename)) {
  console.log(cyan('Tips:'), `Using local version of '${name}'`);
} else {
  // eslint-disable-next-line global-require
  require('..');
}
