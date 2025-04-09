import generate from '@babel/generator';

import {
  babelParse,
  compileScript,
  parse as parseSFC,
} from '@vue/compiler-sfc';

import { action } from './action.mjs';
import { transformer } from './transformer.mjs';

export function parse(raw) {
  const { descriptor } = parseSFC(raw, {
    sourceMap: false,
    templateParseOptions: { comments: false },
  });

  descriptor.tpl = descriptor.template
    ? action(descriptor.template).tpl
    : '<!-- -->';

  if (!descriptor.scriptSetup && !descriptor.script?.content) {
    descriptor.code = '';

    return descriptor;
  }

  const id = '$$mainBlock';

  if (
    descriptor.scriptSetup ||
    descriptor.script.content.includes('export default ')
  ) {
    const result = compileScript(descriptor, {
      id,
      sourceMap: false,
      genDefaultAs: id,
    });

    const pair = result.imports
      ? Object.values(result.imports)
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

    descriptor.pair = pair;

    const ast = babelParse(result.content, {
      sourceType: 'module',
      plugins: ['importAttributes'],
    });

    const names = pair.map(({ local }) => local);

    const isSetup =
      result.scriptSetupAst &&
      result.scriptSetupAst.some(
        (item) =>
          item.type !== 'ImportDeclaration' ||
          (item.type === 'ImportDeclaration' &&
            item.source?.value?.endsWith('.vue')),
      );

    transformer(ast, names, id, isSetup);

    const { code } = generate.default(ast, { importAttributesKeyword: 'with' });

    descriptor.code = code;

    return descriptor;
  }

  descriptor.code = descriptor.script.content;

  return descriptor;
}
