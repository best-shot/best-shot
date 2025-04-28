'use strict';

const { parse, generate } = require('wxml-parse');
const tabToSpace = require('tab-to-space');

exports.pretty = function pretty(source) {
  const ast = parse(source);
  const io = generate(ast, {
    maxWidth: 80,
    // compress: true,
  });

  return tabToSpace(io, 2);
};
