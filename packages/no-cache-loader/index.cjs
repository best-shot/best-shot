'use strict';

module.exports = function loader(source, map, meta) {
  this.cacheable(false);
  this.callback(null, source, map, meta);
};
