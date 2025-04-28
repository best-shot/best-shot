import { Traverse } from 'neotraverse/modern';

import { ElementTypes, NodeTypes } from '@vue/compiler-core';

const DirectiveTypes = {
  bind: 'DIRECTIVE_BIND',
  model: 'DIRECTIVE_MODEL',
  for: 'DIRECTIVE_FOR',
  text: 'DIRECTIVE_TEXT',
  slot: 'DIRECTIVE_SLOT',
  on: 'DIRECTIVE_ON',
};

function getCurrentVisitor(visitor, node) {
  const { type, tagType, name } = node;

  const visitorName =
    type === ElementTypes.ELEMENT
      ? ElementTypes[tagType] || NodeTypes[type]
      : type === NodeTypes.DIRECTIVE
        ? DirectiveTypes[name] || NodeTypes[type]
        : NodeTypes[type];

  return visitor[visitorName] || visitor.FALLBACK;
}

const neadClean = ['loc', 'nameLoc', 'rawName', 'source', 'codegenNode'];

function clear(node) {
  neadClean.forEach((key) => {
    if (key in node) {
      if (node.type === 0 && key === 'source') {
        node[key] = '';
      } else {
        delete node[key];
      }
    }

    if (node.exp && key in node.exp) {
      delete node.exp[key];
    }

    if (node.arg && key in node.arg) {
      delete node.arg[key];
    }
  });
}

export { ElementTypes, NodeTypes };

function traverseChildrenOrProps(items, visitor) {
  if (Array.isArray(items) && items.length > 0) {
    items.forEach((item) => {
      // eslint-disable-next-line no-use-before-define
      traverse(item, visitor);
    });
  }
}

export function traverse(ast, visitor = {}) {
  if (!ast) {
    return;
  }

  new Traverse(ast).forEach((ctx, node) => {
    if (typeof node === 'object' && node !== null) {
      clear(node);

      if ('type' in node) {
        traverseChildrenOrProps(node.children, visitor);
        // traverseChildrenOrProps(node.props, visitor);

        const currentVisitor = getCurrentVisitor(visitor, node);

        if (currentVisitor) {
          const io = currentVisitor(node, ctx);

          if (io !== undefined) {
            ctx.update(io, true);
          }
        }
      }
    }
  });
}
