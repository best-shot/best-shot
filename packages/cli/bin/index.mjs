#!/usr/bin/env node
import 'v8-compile-cache';

import pkg from 'chalk';
import isInstalledGlobally from 'is-installed-globally';
import { createRequire } from 'module';

import { action } from '../index.mjs';

const { red } = pkg;

const { name } = createRequire(import.meta.url)('../package.json');

if (isInstalledGlobally) {
  console.log(red('Error:'), `'${name}' shouldn't be installed globally`);
  process.exitCode = 1;
} else {
  action();
}
