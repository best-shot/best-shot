#!/usr/bin/env node

import { createRequire } from 'module';

import isInstalledGlobally from 'is-installed-globally';

import { action } from '../index.mjs';

const { name } = createRequire(import.meta.url)('../package.json');

if (isInstalledGlobally) {
  console.log(`'${name}'`, "shouldn't be installed globally");
  process.exitCode = 1;
} else {
  action();
}
