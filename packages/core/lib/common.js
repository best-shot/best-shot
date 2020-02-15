// @ts-ignore
const { red, supportsColor } = require('chalk');
const { EOL } = require('os');
const { inspect } = require('util');
const pickBy = require('lodash/pickBy');

function uselessFilter(item) {
  return item !== undefined;
}

function objectFilter(object) {
  return pickBy(object, uselessFilter);
}

function arrayFilter(array) {
  return array.filter(uselessFilter);
}

function pick(condition) {
  return item => (condition ? item : undefined);
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
  logRedError,
  pick,
  pretty,
  objectFilter,
  arrayFilter
};
