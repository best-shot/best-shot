import traverse from '@babel/traverse';

const funcName = '$$asComponent';

function importStatement({ imported, local = imported, source }) {
  return {
    type: 'ImportDeclaration',
    specifiers: [
      {
        type: 'ImportSpecifier',
        imported: {
          type: 'Identifier',
          name: imported,
        },
        local: {
          type: 'Identifier',
          name: local,
        },
      },
    ],
    source: {
      type: 'StringLiteral',
      value: source,
    },
  };
}

export function transformer(ast, names, id, isSetup) {
  let hasImport = false;

  traverse.default(ast, {
    ImportDeclaration(path) {
      if (
        path.node.specifiers.some((specifier) => specifier.local === funcName)
      ) {
        hasImport = true;
      }
    },
    ImportDefaultSpecifier(path) {
      if (names.includes(path.node.local.name)) {
        path.parentPath.remove();
      }
    },
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier' && path.node.id.name === id) {
        path.traverse({
          ObjectMethod(subPath) {
            if (
              subPath.node.key.name === 'setup' &&
              (subPath.parentPath.parentPath.parentPath === path ||
                subPath.parentPath.parentPath === path)
            ) {
              subPath.node.params[1] = {
                type: 'Identifier',
                name: 'context',
              };

              subPath.traverse({
                // ObjectProperty(subPath2) {
                //   if (
                //     subPath2.node.key.name === 'expose' &&
                //     subPath2.node.value.name === '__expose' &&
                //     subPath2.parentPath.parentPath === subPath
                //   ) {
                //     subPath2.remove();
                //   }
                // },
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

  if (!hasImport) {
    ast.program.body.push({
      type: 'ExpressionStatement',
      expression: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: funcName,
        },
        arguments: [
          {
            type: 'Identifier',
            name: id,
          },
        ],
      },
    });

    const statement = importStatement(
      isSetup
        ? {
            imported: funcName,
            source: '@best-shot/sfc-split-plugin/hack/mini.js',
          }
        : {
            imported: funcName,
            source: '@best-shot/sfc-split-plugin/hack/base.js',
          },
    );

    ast.program.body.unshift(statement);
  }
}
