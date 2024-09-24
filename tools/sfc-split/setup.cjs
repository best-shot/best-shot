'use strict';

const { compileScript } = require('@vue/compiler-sfc');
const { transformer } = require('./parser.cjs');

exports.vueMiniCode = function vueMiniCode(descriptor) {
  if (!descriptor.scriptSetup && !descriptor.script?.content) {
    return '';
  }

  const id = '$$mainBlock';

  if (
    descriptor.scriptSetup ||
    descriptor.script.content.includes('export default ')
  ) {
    const raw = compileScript(descriptor, {
      id,
      sourceMap: false,
      genDefaultAs: id,
    });

    console.log(raw);

    const pair = raw.imports
      ? Object.values(raw.imports)
          .filter(
            ({ imported, isFromSetup, isType, source }) =>
              !isType &&
              isFromSetup &&
              imported === 'default' &&
              source.endsWith('.vue'),
          )
          .map(({ source, local }) => ({
            local,
            source,
          }))
      : [];

    const { code } = transformer(raw.content, pair);

    return {
      pair,
      code: [
        raw.scriptSetupAst &&
        raw.scriptSetupAst.some((item) => item.type !== 'ImportDeclaration')
          ? "import { defineComponent as $$asComponent } from '@vue-mini/core';"
          : "import { $$asComponent } from '@best-shot/sfc-split-plugin/hack/base.js';",
        code,
        `$$asComponent(${id});`,
      ]
        .filter(Boolean)
        .join('\n'),
    };
  }

  return { code: descriptor.script.content };
};
