'use strict';

function walk(node, transform) {
  for (const [index, theProp] of Object.entries(node.props)) {
    const transformed = transform(theProp, index, node);

    if (Array.isArray(transformed)) {
      const [first, ...rest] = transformed;
      node.props.splice(index, 1, first);

      node.props.push(...rest);
    } else {
      node.props.splice(index, 1, transformed);
    }
  }
}

function braces(str) {
  return `{{ ${str.trim()} }}`;
}

function asProp(name, content, brace = true) {
  return {
    type: 6,
    name,
    value: content
      ? { type: 2, content: brace ? braces(content) : content }
      : undefined,
  };
}

const actions = {
  click: 'tap',
};

function bind(name, content) {
  return asProp(`bind:${actions[name] || name}`, content, false);
}

function transformProps1(prop) {
  if (prop.type === 7 && prop.name === 'for') {
    const { source, value, key } = prop.forParseResult;

    return [
      asProp('wx:for', source.content),
      asProp('wx:for-item', value.content, false),
      key?.content ? asProp('wx:for-index', key?.content, false) : undefined,
    ].filter(Boolean);
  }

  return prop;
}

function transformProps2(prop, index, node) {
  if (prop.type === 7 && prop.name === 'bind' && prop.arg.content === 'class') {
    const raw = node.props.find((p) => p.type === 6 && p.name === 'class');

    prop.exp.content = raw
      ? `clsx.clsx('${raw.value.content}', ${prop.exp.content})`
      : `clsx.clsx(${prop.exp.content})`;
  }

  return prop;
}

function transformProps3(prop, index, node) {
  if (prop.type === 7) {
    switch (prop.name) {
      case 'on': {
        return bind(prop.arg.content, prop.exp.content);
      }
      case 'bind': {
        if (prop.arg.content === 'key') {
          const io = node.props.find((item) => item.name === 'wx:for-item');

          return asProp(
            'wx:key',
            io?.value?.content
              ? prop.exp.content.replace(
                  new RegExp(`^${io.value.content}.`),
                  '',
                )
              : prop.exp.content,
            false,
          );
        }

        return asProp(prop.arg.content, prop.exp.content);
      }
      case 'model': {
        return asProp(
          `model:${prop.arg?.content || 'value'}`,
          prop.exp?.content ? prop.exp?.content.replaceAll('.', '_') : '',
        );
      }
      case 'if': {
        return asProp('wx:if', prop.exp.content);
      }
      case 'else-if': {
        return asProp('wx:elif', prop.exp.content);
      }
      case 'else': {
        return asProp('wx:else');
      }
      default: {
        console.log(prop);
      }
    }
  }

  return prop;
}

function traverse(ast, enter) {
  for (const child of ast.children) {
    if (child.type === 1 || child.type === 2) {
      enter(child);
    }

    if (child.children?.length > 0) {
      traverse(child, enter);
    }
  }
}

exports.transform = function transform(ast, { tagMatcher } = {}) {
  const tags = new Set();

  traverse(ast, (node) => {
    if (node.type === 2) {
      node.content = node.content.trim();
    } else if (node.type === 1) {
      if (tagMatcher && node.tag.startsWith(tagMatcher)) {
        tags.add(node.tag);
      }
      /* eslint-disable no-param-reassign */
      switch (node.tag) {
        case 'template': {
          node.tag = 'block';
          break;
        }
        case 'span': {
          node.tag = 'text';
          break;
        }
        case 'div':
        case 'p': {
          node.tag = 'view';
          break;
        }
        default:
      }
      const vTextIndex = node.props.findIndex(
        (prop) => prop.type === 7 && prop.name === 'text',
      );

      if (vTextIndex !== -1) {
        const [temp] = node.props.splice(vTextIndex, 1);

        node.children = [
          temp.exp.ast?.type === 'StringLiteral'
            ? { type: 2, content: temp.exp.ast.value }
            : { type: 5, content: temp.exp },
        ];

        if (node.isSelfClosing) {
          delete node.isSelfClosing;
        }
      }

      /* eslint-enable no-param-reassign */
      if (node.props.length > 0) {
        walk(node, transformProps1);
        walk(node, transformProps2);

        if (
          node.props.some((prop) => prop.type === 6 && prop.name === 'class') &&
          node.props.some(
            (prop) =>
              prop.type === 7 &&
              prop.name === 'bind' &&
              prop.arg.content === 'class',
          )
        ) {
          node.props.splice(
            node.props.findIndex(
              (prop) => prop.type === 6 && prop.name === 'class',
            ),
            1,
          );
        }

        walk(node, transformProps3);
      }
    }
  });

  return {
    tags: [...tags],
    ast,
  };
};
