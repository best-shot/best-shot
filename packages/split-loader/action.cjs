'use strict';

const { transform } = require('./ast.cjs');
const { serializeTemplate } = require('@padcom/vue-ast-serializer');
const synchronizedPrettier = require('@prettier/sync');

exports.action = function action(template) {
  const { ast } = transform(template.ast);

  const tmp1 = serializeTemplate({ ast }).replace(
    /^<template>([\S\s]+)<\/template>$/,
    '$1',
  );

  try {
    return synchronizedPrettier.format(tmp1, {
      parser: 'html',
      htmlWhitespaceSensitivity: 'ignore',
    });
  } catch (error) {
    console.warn('Error:', error);

    return tmp1;
  }
};
