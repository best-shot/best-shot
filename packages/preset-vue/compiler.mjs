import { parse as parseRaw } from '@vue/compiler-sfc';

function isConfig(customBlock) {
  return (
    customBlock.type === 'config' &&
    (customBlock.lang === 'yaml' || customBlock.lang === 'json')
  );
}

export function parse(string) {
  const ast = parseRaw(string);

  if (
    !ast.descriptor.customBlocks?.length ||
    !ast.descriptor.customBlocks.some((customBlock) => isConfig(customBlock))
  ) {
    return ast;
  }

  ast.descriptor.customBlocks = ast.descriptor.customBlocks.filter(
    (customBlock) => !isConfig(customBlock),
  );

  return ast;
}
