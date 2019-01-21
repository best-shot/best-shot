const { resolve } = require('path');
const { red, supportsColor } = require('chalk');
const { EOL } = require('os');
const { inspect } = require('util');

class ExError extends Error {
  constructor(message, extra) {
    super(message);
    this.extra = extra;
  }
}

function uselessFilter(item) {
  return item !== undefined;
}

function currentPath(...args) {
  return resolve(process.cwd(), ...args);
}

function pick(condition) {
  return item => (condition ? item : undefined);
}

function commandEnv(command) {
  return (
    {
      dev: 'development',
      serve: 'development',
      watch: 'development',
      prod: 'production'
    }[command] || 'development'
  );
}

function logRedError(message, extra) {
  console.log(red`Error:`, message, extra ? EOL + extra + EOL : EOL);
}

function pretty(data) {
  return inspect(data, {
    compact: false,
    colors: Boolean(supportsColor.level),
    breakLength: 80,
    depth: 20
  });
}

module.exports = {
  ExError,
  commandEnv,
  currentPath,
  logRedError,
  pick,
  pretty,
  uselessFilter
};
