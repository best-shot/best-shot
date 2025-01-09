import generate from '@babel/generator';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

function removeImport(ast, names) {
  traverse.default(ast, {
    ImportDefaultSpecifier(path) {
      if (names.includes(path.node.local.name)) {
        // path.parentPath.remove();
      }
    },
    VariableDeclarator(path) {
      if (
        path.node.id.type === 'Identifier' &&
        path.node.id.name === '$$mainBlock'
      ) {
        path.traverse({
          ObjectMethod(subPath) {
            if (
              subPath.node.key.name === 'setup' &&
              (subPath.parentPath.parentPath.parentPath === path ||
                subPath.parentPath.parentPath === path)
            ) {
              subPath.traverse({
                ObjectProperty(subPath2) {
                  if (
                    subPath2.node.key.name === 'expose' &&
                    subPath2.node.value.name === '__expose' &&
                    subPath2.parentPath.parentPath === subPath
                  ) {
                    subPath2.remove();
                  }
                },
                VariableDeclarator(subPath2) {
                  if (
                    subPath2.node.id.name === '__returned__' &&
                    subPath2.parentPath.parentPath.parentPath === subPath
                  ) {
                    path.traverse({
                      ObjectProperty(subPath3) {
                        if (
                          names.includes(subPath3.node.key.name) &&
                          subPath3.parentPath.parentPath === subPath2
                        ) {
                          subPath3.remove();
                        }
                      },
                    });
                  }
                },
                ExpressionStatement(subPath2) {
                  if (
                    subPath2.node.expression?.callee?.type === 'Identifier' &&
                    subPath2.node.expression.callee.name === '__expose' &&
                    subPath2.parentPath.parentPath === subPath
                  ) {
                    subPath2.remove();
                  }
                },
                CallExpression(subPath2) {
                  if (
                    subPath2.node.callee.type === 'MemberExpression' &&
                    subPath2.node.callee.object.type === 'Identifier' &&
                    subPath2.node.callee.object.name === 'Object' &&
                    subPath2.node.callee.property.type === 'Identifier' &&
                    subPath2.node.callee.property.name === 'defineProperty' &&
                    subPath2.node.arguments[0].type === 'Identifier' &&
                    subPath2.node.arguments[0].name === '__returned__' &&
                    subPath2.node.arguments[1].type === 'StringLiteral' &&
                    subPath2.node.arguments[1].value === '__isScriptSetup' &&
                    subPath2.parentPath.parentPath.parentPath === subPath
                  ) {
                    subPath2.remove();
                  }
                },
              });
            }
          },
        });
      }
    },
  });
}

export function transformer(input, pair) {
  const ast = parse(input, {
    sourceType: 'module',
    plugins: ['importAttributes'],
  });

  const names = pair.map(({ local }) => local);

  removeImport(ast, names);

  const { code } = generate.default(ast, {
    importAttributesKeyword: 'with',
  });

  return { code };
}
