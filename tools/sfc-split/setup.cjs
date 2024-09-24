'use strict';

const { compileScript } = require('@vue/compiler-sfc');
const { transformer } = require('./parser.cjs');

exports.vueMiniCode = function vueMiniCode(descriptor) {
  if (!descriptor.scriptSetup && !descriptor.script?.content) {
    return '';
  }

  const id = '$$mainBlock';

  if (descriptor.scriptSetup) {
    const raw = compileScript(descriptor, {
      id,
      sourceMap: false,
      genDefaultAs: id,
    }).content;

    const { code, pair } = transformer(raw);

    return {
      pair,
      code: [
        "import { defineComponent as $$asComponent } from '@vue-mini/core';",
        code,
        `$$asComponent(${id});`,
      ]
        .filter(Boolean)
        .join('\n'),
    };
  }

  if (descriptor.script.content.includes('export default ')) {
    const raw = compileScript(descriptor, {
      id,
      sourceMap: false,
      genDefaultAs: id,
    }).content;

    return {
      code: [
        "import { $$asComponent } from '@best-shot/sfc-split-plugin/hack/base.js';",
        raw,
        `$$asComponent(${id});`,
      ]
        .filter(Boolean)
        .join('\n'),
    };
  }

  return { code: descriptor.script.content };
};
