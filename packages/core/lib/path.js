const slash = require('slash');
const { resolve, relative, join } = require('path');

module.exports = {
  resolve(...path) {
    return slash(resolve(...path));
  },
  relative(from, ...to) {
    return slash(relative(from, join(...to)));
  },
  join(...path) {
    return slash(join(...path));
  },
};
