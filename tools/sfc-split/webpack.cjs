'use strict';

const VirtualModulesPlugin = require('webpack-virtual-modules');
const { parse } = require('@vue/compiler-sfc');
const { readFileSync } = require('node:fs');
const { basename } = require('node:path');
const slash = require('slash');
const { action } = require('./action.cjs');

const PLUGIN_NAME = 'SfcSplitPlugin';

const SFC_EXT = '.vue';

const SFC_EXT_REGEX = /\.vue$/;

module.exports = class SfcSplitPlugin {
  constructor() {
    this.virtualModules = new VirtualModulesPlugin();
  }

  apply(compiler) {
    this.virtualModules.apply(compiler);

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.buildModule.tap(PLUGIN_NAME, (Module) => {
        if (SFC_EXT_REGEX.test(Module.resource)) {
          const filename = Module.resource.replace(SFC_EXT, '');

          const source = readFileSync(Module.resource, 'utf8');

          const paths = this.processSfcFile(source, filename);

          const mock = paths
            .map((path) => `import "./${basename(path)}";`)
            .join('\n');

          console.log(paths, mock);

          this.virtualModules.writeModule(Module.resource, mock);
        }
      });
    });
  }

  inject(filename, ext, content) {
    const path = `${filename}.${ext}`;

    this.virtualModules.writeModule(path, content);

    return path;
  }

  processSfcFile(source, filename) {
    const { script, template, styles, customBlocks } = parse(source).descriptor;

    const paths = [];

    if (script?.content) {
      const path = this.inject(filename, 'js', script.content);
      paths.push(path);
    }

    if (template?.content) {
      const path = this.inject(filename, 'wxml', action(template));
      paths.push(path);
    }

    if (styles?.length > 0) {
      styles.forEach((style, idx) => {
        if (style?.content) {
          const path = this.inject(
            `${filename}-${idx}`,
            style.lang || 'css',
            style.content,
          );
          paths.push(path);
        }
      });
    }

    if (customBlocks?.length > 0) {
      const config = customBlocks.find(
        (block) =>
          block.type === 'config' &&
          block.content &&
          (block.lang === 'json' || block.lang === 'yaml'),
      );

      const path = this.inject(filename, config.lang, config.content);

      paths.push(`${path}?to-url`);
    }

    return paths.map((path) => slash(path));
  }
};
