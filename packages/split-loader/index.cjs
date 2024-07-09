'use strict';

const { parse } = require('@vue/compiler-sfc');
const { relative } = require('node:path');
const slash = require('slash');

function toDataURI(string, mime = 'text/plain') {
  return string ? `data:${mime};base64,${btoa(string.trim())}` : undefined;
}

function importStatement(source) {
  return `import '${source}';`;
}

module.exports = async function loader(source) {
  this.cacheable(true);

  const {
    template,
    styles,
    script,
    customBlocks = [],
  } = parse(source).descriptor;

  const wxml = template?.content;

  const config = customBlocks.find(
    (block) =>
      block.type === 'config' &&
      block.content.trim() &&
      (block.lang === 'json' || block.lang === 'yaml'),
  );

  const css = styles.find((style) => style.content.trim());

  const resourcePath = slash(
    relative(this.rootContext, this.resourcePath),
  ).replace(/\.vue$/, '');

  this.emitFile(`${resourcePath}.wxml`, wxml, 'utf8');

  if (config?.content) {
    this.emitFile(`${resourcePath}.json`, config.content, 'utf8');
  }

  this.callback(
    null,
    css
      ? [
          importStatement(toDataURI(css.content, `text/${css.lang || css}`)),
        ].join('\n')
      : script?.content,
  );
};
