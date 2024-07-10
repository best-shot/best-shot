'use strict';

const { parse } = require('@vue/compiler-sfc');
const { relative } = require('node:path');
const slash = require('slash');
const yaml = require('yaml');
const { action } = require('./action.cjs');

function toDataURI(string, mime = 'text/plain') {
  return string ? `data:${mime};base64,${btoa(string.trim())}` : undefined;
}

function importStatement(source) {
  return `import '${source}';`;
}

module.exports = function loader(source) {
  this.cacheable(true);

  const {
    template,
    styles,
    script,
    customBlocks = [],
  } = parse(source).descriptor;

  const config = customBlocks.find(
    (block) =>
      block.type === 'config' &&
      block.content.trim() &&
      (block.lang === 'json' || block.lang === 'yaml'),
  );

  const css = styles.find(
    (style) =>
      style.content.trim() &&
      (!style.lang ||
        style.lang === 'less' ||
        style.lang === 'scss' ||
        style.lang === 'sass'),
  );

  const resourcePath = slash(
    relative(this.rootContext, this.resourcePath),
  ).replace(/\.vue$/, '');

  if (template?.ast) {
    const tpl = action(template);

    this.emitFile(`${resourcePath}.wxml`, tpl, 'utf8');
  }

  if (config?.content) {
    const content =
      config.lang === 'yaml'
        ? yaml.parse(config.content)
        : JSON.parse(config.content);

    this.emitFile(
      `${resourcePath}.json`,
      JSON.stringify(content, null, 2),
      'utf8',
    );
  }

  const final = css
    ? [
        importStatement(toDataURI(css.content, `text/${css.lang || 'css'}`)),
        script?.content,
      ]
        .filter(Boolean)
        .join('\n')
    : script?.content || '';

  this.callback(null, final);
};
