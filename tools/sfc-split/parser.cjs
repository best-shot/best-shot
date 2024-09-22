'use strict';

const { parse } = require('@babel/parser');
const { default: generate } = require('@babel/generator');
const { default: traverse } = require('@babel/traverse');

function isDefault(specifier) {
  return (
    specifier.type === 'ImportDefaultSpecifier' ||
    (specifier.type === 'ImportSpecifier' &&
      specifier.imported.name === 'default')
  );
}

function remover(ast) {
  const io = [];

  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.source.value.endsWith('.vue')) {
        const target = path.node.specifiers.find((specifier) =>
          isDefault(specifier),
        );

        if (target) {
          io.push({
            name: target.local.name,
            source: path.node.source.value,
          });
          path.remove();
        }
      }
    },
  });

  return io;
}

exports.transformer = function transformer(input) {
  if (!input.includes('.vue')) {
    return { code: input, pair: [] };
  }

  const ast = parse(input, {
    sourceType: 'module',
    plugins: ['importAttributes'],
  });

  const pair = remover(ast);

  const { code } = generate(ast, {
    importAttributesKeyword: 'with',
  });

  return { code, pair };
};
