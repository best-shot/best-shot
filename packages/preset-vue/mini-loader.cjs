'use strict';

const { parse } = require('vue/compiler-sfc');
const { stringify } = require('@padcom/vue-ast-serializer');

function isConfig(item) {
  return !(
    item.type === 'config' &&
    (item.lang === 'json' || item.lang === 'yaml')
  );
}

module.exports = function loader(source) {
  const ast = parse(source);

  const { descriptor } = ast;

  if (
    descriptor.scriptSetup?.content &&
    descriptor.scriptSetup.content.includes('@inject-hack@')
  ) {
    return source;
  }

  ast.descriptor.customBlocks = //
    descriptor.customBlocks.filter((item) => isConfig(item));

  ast.descriptor.scriptSetup ||= {
    content: '',
    setup: true,
    type: 'script',
    attrs: { setup: true },
  };

  ast.descriptor.scriptSetup.content = [
    '/* @inject-hack@ */',
    'import qs from "ext-to-regexp";',
    ast.descriptor.scriptSetup.content,
  ].join('\n');

  return stringify(ast);
};
