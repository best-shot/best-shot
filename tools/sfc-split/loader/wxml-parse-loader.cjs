'use strict';

const { pretty } = require('../parse/pretty.cjs');

module.exports = function loader(source) {
  this.cacheable();

  const callback = this.async();

  try {
    callback(null, pretty(source));
  } catch (error) {
    console.error(error);
    callback(null, source);
  }
};
