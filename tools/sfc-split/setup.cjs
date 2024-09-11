'use strict';

const { compileScript } = require('@vue/compiler-sfc');

exports.vueMiniCode = function vueMiniCode(descriptor) {
  if (!descriptor.scriptSetup && !descriptor.script?.content) {
    return descriptor.script.content;
  }

  const id = '$$mainBlock';

  const raw = compileScript(descriptor, {
    id,
    sourceMap: false,
    genDefaultAs: id,
  }).content;

  return (
    descriptor.scriptSetup
      ? [
          "import { defineComponent as $$asComponent } from '@vue-mini/core';",
          raw
            .replace('__expose();', '')
            .replace(/expose:\s__expose,?/, '')
            .replace(
              "Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })",
              '',
            ),
          `$$asComponent(${id});`,
        ]
      : descriptor.script.content.includes('export default ')
        ? [
            "import { $$asComponent } from '@best-shot/sfc-split-plugin/hack/base.js';",
            raw,
            `$$asComponent(${id});`,
          ]
        : [raw]
  )
    .filter(Boolean)
    .join('\n');
};
