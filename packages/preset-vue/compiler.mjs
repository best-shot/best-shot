import { parse as parseRaw } from '@vue/compiler-sfc';
// import { mergeConfig } from '@best-shot/sfc-split-plugin/lib.cjs';
// import { pascalcase } from 'pascalcase';

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

  ast.descriptor.customBlocks = ast.descriptor.customBlocks.filter(
    (customBlock) => !isConfig(customBlock),
  );

  // const config = mergeConfig(configs);

  // if (
  //   config.usingComponents &&
  //   Object.keys(config.usingComponents).length > 0
  // ) {
  // const io = [];
  // for (const [key, path] of Object.entries(config.usingComponents)) {
  //   if (path.endsWith('.vue')) {
  //     io.push(`import ${pascalcase(key)} from '${path}';`);
  //   }
  // }
  // if (io.length > 0) {
  //   ast.descriptor.scriptSetup ||= {
  //     content: ' ',
  //     setup: true,
  //     type: 'script',
  //     attrs: { setup: true },
  //   };
  //   ast.descriptor.script ||= {
  //     type: 'script',
  //     attrs: {},
  //     content: ' ',
  //   };
  //   console.log(ast.descriptor.scriptSetup);
  //   // console.log([ast.descriptor]);
  // }
  // }

  return ast;
}
