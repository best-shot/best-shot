import { serializeTemplate } from '@padcom/vue-ast-serializer';
import { kebabCase } from 'change-case';

function walk(node, transfer) {
  for (const [index, theProp] of Object.entries(node.props)) {
    const transformed = transfer(theProp, index, node);

    if (Array.isArray(transformed)) {
      const [first, ...rest] = transformed;
      node.props.splice(index, 1, first);
      node.props.push(...rest);
    } else if (
      transformed === undefined ||
      transformed === false ||
      transformed === null
    ) {
      delete node.props[index];
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
        return prop.arg?.content && prop.exp?.content
          ? bind(prop.arg.content, prop.exp.content)
          : undefined;
      }
      case 'bind': {
        if (prop.arg?.content === 'key') {
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

        if (prop.arg?.content.startsWith('generic:') && prop.exp.content) {
          return asProp(prop.arg?.content, kebabCase(prop.exp.content), false);
        }

        return prop.arg?.content
          ? asProp(prop.arg.content, prop.exp?.content ?? prop.arg.content)
          : prop;
      }
      case 'model': {
        return prop.exp?.content
          ? asProp(
              `model:${kebabCase(prop.arg?.content || 'modelValue')}`,
              prop.exp.content.replaceAll('.', '_'),
            )
          : prop;
      }
      case 'if': {
        return prop.exp.content ? asProp('wx:if', prop.exp.content) : prop;
      }
      case 'else-if': {
        return prop.exp.content ? asProp('wx:elif', prop.exp.content) : prop;
      }
      case 'else': {
        return asProp('wx:else');
      }
      case 'slot': {
        return prop.arg?.content
          ? asProp('slot', prop.arg.content, false)
          : prop;
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

function transform(ast, { tagMatcher } = {}) {
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
        case 'img': {
          node.tag = 'image';
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
        default: {
          if (node.tagType === 1) {
            node.tag = kebabCase(node.tag);
          }
        }
      }
      const vTextIndex = node.props.findIndex(
        (prop) => prop?.type === 7 && prop.name === 'text',
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
    tags: [...tags], // TODO
    ast,
  };
}

export function action(template, options) {
  const { ast, tags } = transform(template.ast, options);

  const tpl = serializeTemplate({ ast }).replace(
    /^<template>([\s\S]+)<\/template>$/,
    '$1',
  );

  return { tpl, tags };
}
