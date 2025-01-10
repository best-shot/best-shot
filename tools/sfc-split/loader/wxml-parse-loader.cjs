'use strict';

const { parse, generate } = require('wxml-parse');
const tabToSpace = require('tab-to-space');

module.exports = function loader(source) {
  this.cacheable();

  const callback = this.async();

  try {
    const ast = parse(source);

    const io = generate(ast, {
      maxWidth: 80,
      // compress: true,
    });

    callback(null, tabToSpace(io, 2));
  } catch (error) {
    console.error(error);
    callback(null, source);
  }
};
