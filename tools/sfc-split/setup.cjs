'use strict';

const { compileScript } = require('@vue/compiler-sfc');
const { transformer } = require('./parser.cjs');

exports.vueMiniCode = function vueMiniCode(descriptor) {
  if (!descriptor.scriptSetup && !descriptor.script?.content) {
    return '';
  }

  const id = '$$mainBlock';

  const raw = compileScript(descriptor, {
    id,
    sourceMap: false,
    genDefaultAs: id,
  }).content;

  const result = descriptor.scriptSetup
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
      : [raw];

  const code = result.filter(Boolean).join('\n');

  return transformer(code);
};
