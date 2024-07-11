'use strict';

function braces(str) {
  return `{{ ${str.trim()} }}`;
}

function prop(name, content, brace = true) {
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
  return prop(`bind:${actions[name] || name}`, content, false);
}

function transformProps(props) {
  if (props.type === 7) {
    switch (props.name) {
      case 'on': {
        return bind(props.arg.content, props.exp.content);
      }
      case 'bind': {
        if (props.arg.content === 'key') {
          return prop('wx:key', props.exp.content, false);
        }

        return prop(props.arg.content, props.exp.content);
      }
      case 'model': {
        return prop(`model:${props.arg.content}`, props.exp.content);
      }
      case 'for': {
        const { source, value, key } = props.forParseResult;

        return [
          prop('wx:for', source.content),
          prop('wx:for-item', value.content, false),
          key?.content ? prop('wx:for-index', key?.content, false) : undefined,
        ].filter(Boolean);
      }
      case 'if': {
        return prop('wx:if', props.exp.content);
      }
      case 'else-if': {
        return prop('wx:elif', props.exp.content);
      }
      case 'else': {
        return prop('wx:else');
      }
      default: {
        console.log(props);
      }
    }
  }

  return props;
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
        const transformed = transformProps(theProp);

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
