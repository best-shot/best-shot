'use strict';

const { transform } = require('./ast.cjs');
const { serializeTemplate } = require('@padcom/vue-ast-serializer');

exports.action = function action(template, options) {
  const { ast, tags } = transform(template.ast, options);

  const tpl = serializeTemplate({ ast }).replace(
    /^<template>([\S\s]+)<\/template>$/,
    '$1',
  );

  return { tpl, tags };
};
