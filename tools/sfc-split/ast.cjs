'use strict';

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
  if (prop.type === 7) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (prop.name) {
      case 'for': {
        const { source, value, key } = prop.forParseResult;

        return [
          asProp('wx:for', source.content),
          asProp('wx:for-item', value.content, false),
          key?.content
            ? asProp('wx:for-index', key?.content, false)
            : undefined,
        ].filter(Boolean);
      }
      default:
    }
  }

  return prop;
}

function transformProps2(prop, index, props) {
  if (prop.type === 7) {
    switch (prop.name) {
      case 'on': {
        return bind(prop.arg.content, prop.exp.content);
      }
      case 'bind': {
        if (prop.arg.content === 'key') {
          const io = props.find((item) => item.name === 'wx:for-item');

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
        return asProp(`model:${prop.arg.content}`, prop.exp.content);
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
    if (child.type === 1) {
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
      case 'div': {
        node.tag = 'view';
        break;
      }
      default:
    }
    /* eslint-enable no-param-reassign */
    if (node.props.length > 0) {
      for (const [index, theProp] of Object.entries(node.props)) {
        const transformed = transformProps1(theProp);

        if (Array.isArray(transformed)) {
          const [first, ...rest] = transformed;
          node.props.splice(index, 1, first);

          node.props.push(...rest);
        } else {
          node.props.splice(index, 1, transformed);
        }
      }

      for (const [index, theProp] of Object.entries(node.props)) {
        const transformed = transformProps2(theProp, index, node.props);

        if (Array.isArray(transformed)) {
          const [first, ...rest] = transformed;
          node.props.splice(index, 1, first);

          node.props.push(...rest);
        } else {
          node.props.splice(index, 1, transformed);
        }
      }
    }
  });

  return {
    tags: [...tags],
    ast,
  };
};
