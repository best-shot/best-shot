import { parse as parseRaw } from '@vue/compiler-sfc';

export {
  extractIdentifiers,
  generateCodeFrame,
  isInDestructureAssignment,
  isStaticProperty,
  walkIdentifiers,
  MagicString,
  babelParse,
  compileScript,
  compileStyle,
  compileStyleAsync,
  compileTemplate,
  errorMessages,
  extractRuntimeEmits,
  extractRuntimeProps,
  inferRuntimeType,
  invalidateTypeCache,
  parseCache,
  registerTS,
  resolveTypeElements,
  rewriteDefault,
  rewriteDefaultAST,
  shouldTransformRef,
  version,
  walk,
} from '@vue/compiler-sfc';

export function parse(string) {
  const ast = parseRaw(string);

  if (ast.descriptor.customBlocks?.length > 0) {
    ast.descriptor.customBlocks = ast.descriptor.customBlocks.filter(
      (io) =>
        !(io.type === 'config' && (io.lang === 'yaml' || io.lang === 'json')),
    );
  }

  console.log(ast.descriptor.customBlocks);

  return ast;
}
