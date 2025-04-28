import traverse from '@babel/traverse';
import * as t from '@babel/types';
import babelPlugin from 'prettier/plugins/babel.mjs';

function transformMultilineStringToTemplateLiteral(ast) {
  traverse.default(ast, {
    StringLiteral(path) {
      const { node } = path;
      if (node.value.includes('\n')) {
        const templateElement = t.templateElement(
          {
            raw: node.value,
            cooked: node.value,
          },
          true,
        );
        const templateLiteral = t.templateLiteral([templateElement], []);
        path.replaceWith(templateLiteral);
      }
    },
  });
  return ast;
}

export const parsers = {
  babel: {
    ...babelPlugin.parsers.babel,
    parse(text, parsers, options) {
      const ast = babelPlugin.parsers.babel.parse(text, parsers, options);
      return transformMultilineStringToTemplateLiteral(ast);
    },
  },
};
