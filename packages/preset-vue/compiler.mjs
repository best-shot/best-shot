// eslint-disable-next-line import/no-extraneous-dependencies
import { mergeConfig } from '@best-shot/sfc-split-plugin/lib.cjs';
import { pascalcase } from 'pascalcase';

import { parse as parseRaw } from '@vue/compiler-sfc';

function isConfig(customBlock) {
  return (
    customBlock.type === 'config' &&
    (customBlock.lang === 'yaml' || customBlock.lang === 'json')
  );
}

export function parse(string) {
  const ast = parseRaw(string);

  if (!ast.descriptor.customBlocks?.length) {
    return ast;
  }

  const configs = ast.descriptor.customBlocks.filter((customBlock) =>
    isConfig(customBlock),
  );

  if (configs.length === 0) {
    return ast;
  }

  const config = mergeConfig(configs);

  if (
    !(config.usingComponents && Object.keys(config.usingComponents).length > 0)
  ) {
    return ast;
  }

  console.log(ast);

  const imports = [...Object.entries(config.usingComponents)]
    .filter(([_, path]) => path.endsWith('.vue'))
    .map(([key, path]) => `import ${pascalcase(key)} from '${path}';`);

  const source = ast.descriptor.scriptSetup
    ? ast.descriptor.source.replace(
        '<script setup>',
        ['<script setup>', ...imports].join('\n'),
      )
    : [
        ast.descriptor.source,
        '<script setup>',
        ...imports,
        '</script setup>',
      ].join('\n');

  const newAst = parseRaw(source);

  newAst.descriptor.customBlocks = newAst.descriptor.customBlocks.filter(
    (customBlock) => !isConfig(customBlock),
  );

  return newAst;
}
