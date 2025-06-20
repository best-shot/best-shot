'use strict';

const { pretty } = require('@into-mini/sfc-template-traverse/pretty.cjs');

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
