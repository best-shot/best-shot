import { serializeTemplate } from '@padcom/vue-ast-serializer';

import { transform } from './ast.mjs';

export function action(template, options) {
  const { ast, tags } = transform(template.ast, options);

  const tpl = serializeTemplate({ ast }).replace(
    /^<template>([\s\S]+)<\/template>$/,
    '$1',
  );

  return { tpl, tags };
}
