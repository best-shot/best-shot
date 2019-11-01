'use strict';

const slash = require('slash');
const { resolve, relative, join, sep } = require('path');

module.exports = {
  resolve(...path) {
    return slash(resolve(...path));
  },
  relative(from, ...to) {
    return slash(relative(from, join(...to)));
  },
  child(from, ...to) {
    return slash(`.${sep}${relative(from, join(...to))}`);
  },
  join(...path) {
    return slash(join(...path));
  }
};
