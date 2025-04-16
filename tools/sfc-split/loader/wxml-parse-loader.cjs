'use strict';

const { parse, generate } = require('wxml-parse');
const tabToSpace = require('tab-to-space');

function transform(source) {
  const ast = parse(source);
  const io = generate(ast, {
    maxWidth: 80,
    // compress: true,
  });
  return tabToSpace(io, 2);
}

module.exports = function loader(source) {
  this.cacheable();

  const callback = this.async();

  try {
    callback(null, transform(source));
  } catch (error) {
    console.error(error);
    callback(null, source);
  }
};
