'use strict';

const { readFileSync } = require('node:fs');
const { basename } = require('node:path');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const { parse } = require('@vue/compiler-sfc');
const { parse: yamlParse } = require('yaml');
const { deepmerge: deepMerge } = require('deepmerge-ts');
const { action } = require('./action.cjs');

const PLUGIN_NAME = 'SfcSplitPlugin';

const SFC_EXT = '.vue';

const SFC_EXT_REGEX = /\.vue$/;

function importStatements(paths) {
  return paths.map((path) => `import "./${basename(path)}";`).join('\n');
}

function mergeConfig(customBlocks) {
  const configs = customBlocks
    .filter(
      (block) =>
        block.type === 'config' &&
        (block.lang === 'json' || block.lang === 'yaml') &&
        block.content &&
        block.content.trim(),
    )
    .map((block) =>
      block.lang === 'yaml'
        ? yamlParse(block.content)
        : JSON.parse(block.content),
    );

  return configs.length > 1
    ? (deepMerge.default || deepMerge)(...configs)
    : configs[0];
}

module.exports = class SfcSplitPlugin {
  constructor() {
    this.virtualModules = new VirtualModulesPlugin();
  }

  apply(compiler) {
    this.virtualModules.apply(compiler);

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.buildModule.tap(PLUGIN_NAME, (Module) => {
        if (SFC_EXT_REGEX.test(Module.resource)) {
          const source = readFileSync(Module.resource, 'utf8');

          const filename = Module.resource.replace(SFC_EXT, '');

          const paths = this.processSfcFile(source, filename);

          this.injectURLs(Module.resource, paths);
        }
      });
    });
  }

  injectURLs(resource, paths) {
    const mock = importStatements(paths);

    this.virtualModules.writeModule(resource, mock);
  }

  inject(filename, ext, content) {
    const path = `${filename}.${ext}`;

    this.virtualModules.writeModule(path, content);

    return path;
  }

  injectCSS(filename, id, ext, content) {
    return this.inject(`${filename}-${id}`, ext || 'css', content);
  }

  injectJSON(filename, json) {
    return this.inject(filename, 'json', JSON.stringify(json, null, 2));
  }

  processSfcFile(source, filename) {
    const { script, template, styles, customBlocks } = parse(source).descriptor;

    const paths = [];

    if (customBlocks?.length > 0) {
      const path = this.injectJSON(filename, mergeConfig(customBlocks));

      paths.push(`${path}?to-url`);
    }

    if (styles?.length > 0) {
      styles.forEach((style, idx) => {
        if (style?.content) {
          const path = this.injectCSS(filename, idx, style.lang, style.content);
          paths.push(path);
        }
      });
    }

    if (template?.content) {
      const path = this.inject(filename, 'wxml', action(template).tpl);
      paths.push(path);
    }

    if (script?.content) {
      const path = this.inject(filename, 'js', script.content);
      paths.push(path);
    }

    return paths;
  }
};
