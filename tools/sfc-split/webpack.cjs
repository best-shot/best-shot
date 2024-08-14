'use strict';

const { readFileSync } = require('node:fs');
const { basename, join, relative } = require('node:path');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const { parse } = require('@vue/compiler-sfc');
const { parse: yamlParse } = require('yaml');
const { deepmerge: deepMerge } = require('deepmerge-ts');
const { action } = require('./action.cjs');
const slash = require('slash');
const { EntryPlugin } = require('webpack');

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

module.exports = class SfcSplitPlugin extends VirtualModulesPlugin {
  apply(compiler) {
    super.apply(compiler);

    this.context = compiler.context;

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.buildModule.tap(PLUGIN_NAME, (Module) => {
        if (SFC_EXT_REGEX.test(Module.resource)) {
          const source = readFileSync(Module.resource, 'utf8');

          const filename = Module.resource.replace(SFC_EXT, '');

          try {
            const { paths, entries } = this.processSfcFile(source, filename);

            this.injectURLs(Module.resource, paths);

            for (const entry of entries) {
              if (!compilation.entries.has(entry)) {
                compilation.addEntry(
                  compiler.context,
                  EntryPlugin.createDependency(`./${entry}.vue`),
                  entry,
                  (err) => {
                    if (err) {
                      throw err;
                    }
                  },
                );
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      });
    });
  }

  injectURLs(resource, paths) {
    const mock = importStatements(paths);

    super.writeModule(resource, mock);
  }

  inject(filename, ext, content) {
    const path = `${filename}.${ext}`;

    super.writeModule(path, content);

    return path;
  }

  injectStyle(filename, id, style) {
    return this.inject(`${filename}-${id}`, style.ext || 'css', style.content);
  }

  injectStyles(filename, styles) {
    const io = [];

    const css = styles?.length > 0 ? styles : [{ content: '/* */' }];

    css.forEach((style, idx) => {
      if (style?.content) {
        const path = this.injectStyle(filename, idx, style);
        io.push(path);
      }
    });

    return io;
  }

  injectTemplate(filename, template) {
    return this.inject(
      filename,
      'wxml',
      template ? action(template).tpl : '<!-- -->',
    );
  }

  injectScript(filename, script) {
    return this.inject(filename, 'js', script.content);
  }

  injectConfig(filename, customBlocks) {
    const json = mergeConfig(
      customBlocks.length > 0
        ? customBlocks
        : [{ type: 'config', lang: 'json', content: '{ }' }],
    );

    const entries = this.mapComponentsEntries(filename, json.usingComponents);

    const config = this.inject(filename, 'json', JSON.stringify(json, null, 2));

    return { config, entries };
  }

  mapComponentsEntries(filename, usingComponents) {
    if (!usingComponents) {
      return [];
    }

    return Object.entries(usingComponents)
      .filter(([_, path]) => path.startsWith('.'))
      .map(([_, path]) => join(filename, '..', path))
      .map((path) => relative(this.context, path))
      .map((path) => slash(path));
  }

  processSfcFile(source, filename) {
    const { script, template, styles, customBlocks } = parse(source).descriptor;

    const paths = [];

    const { config, entries } = this.injectConfig(filename, customBlocks);

    paths.push(`${config}?to-url`);

    const tpl = this.injectTemplate(filename, template);
    paths.push(tpl);

    const io = this.injectStyles(filename, styles);
    paths.push(...io);

    if (script?.content) {
      const js = this.injectScript(filename, script);
      paths.push(js);
    }

    return { paths, entries };
  }
};
