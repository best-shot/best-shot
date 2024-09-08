'use strict';

const { compileScript } = require('@vue/compiler-sfc');

exports.vueMiniCode = function vueMiniCode(descriptor) {
  if (!descriptor.scriptSetup?.content) {
    return descriptor.script?.content;
  }

  const id = '$$mainBlock';

  const code = compileScript(descriptor, {
    id,
    sourceMap: false,
    genDefaultAs: id,
  }).content;

  return [
    code.includes(id)
      ? "import { defineComponent as $$asComponent } from '@vue-mini/core';"
      : undefined,
    code
      .replace('__expose();', '')
      .replace(/expose:\s__expose,?/, '')
      .replace(/\semit: __emit/, ' triggerEvent: __emit')
      .replace(
        "Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })",
        '',
      ),
    code.includes(id) ? `$$asComponent(${id});` : undefined,
  ]
    .filter(Boolean)
    .join('\n');
};
