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
          "import { defineComponent as $$asSetupComponent } from '@vue-mini/core';",
          raw
            .replace('__expose();', '')
            .replace(/expose:\s__expose,?/, '')
            .replace(
              "Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })",
              '',
            ),
          `$$asSetupComponent(${id});`,
        ]
      : descriptor.script.content.includes('export default ')
        ? [
            "import { $$asComponent } from '@best-shot/sfc-split-plugin/hack.js';",
            raw,
            `$$asComponent(${id});`,
          ]
        : [raw]
  )
    .filter(Boolean)
    .join('\n');
};
