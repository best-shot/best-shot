'use strict';

const prettier = require('prettier');

module.exports = function loader(source) {
  this.cacheable();

  const callback = this.async();
  const options = this.getOptions();

  prettier
    .format(source, {
      htmlWhitespaceSensitivity: 'strict',
      printWidth: 5000,
      parser: 'html',
      ...options,
    })
    .then((io) => {
      callback(null, io);
    })
    .catch((error) => {
      console.error(error);
      callback(null, source);
    });
};
