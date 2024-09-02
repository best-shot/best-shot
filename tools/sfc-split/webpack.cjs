'use strict';

const { readFileSync } = require('node:fs');
const { basename, join, relative } = require('node:path');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const { parse, compileScript } = require('@vue/compiler-sfc');
const { parse: yamlParse } = require('yaml');
const { deepmerge: deepMerge } = require('deepmerge-ts');
const { action } = require('./action.cjs');
const slash = require('slash');
const { EntryPlugin, sources } = require('webpack');

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

    const wxs = 'wxs/clsx.wxs';

    compiler.hooks.emit.tapAsync(PLUGIN_NAME, (compilation, callback) => {
      if (!compilation.assets[wxs]) {
        const content = readFileSync(join(__dirname, wxs), 'utf8');
        compilation.assets[wxs] = {
          source: () => content,
          size: () => content.length,
        };
      }

      Object.keys(compilation.assets).forEach((assetName) => {
        if (assetName.endsWith('.wxml')) {
          const asset = compilation.assets[assetName];
          let content = asset.source();

          if (content.includes('clsx.clsx(')) {
            content = `<wxs src="${slash(relative(join(assetName, '..'), wxs))}" module="clsx" />\n\n${content}`;

            compilation.assets[assetName] = {
              source: () => content,
              size: () => content.length,
            };
          }
        }
      });
      callback();
    });

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.buildModule.tap(PLUGIN_NAME, (Module) => {
        if (SFC_EXT_REGEX.test(Module.resource)) {
          const source = readFileSync(Module.resource, 'utf8');

          const filename = Module.resource.replace(SFC_EXT, '');

          try {
            const { paths, entries, config } = this.processSfcFile(
              source,
              filename,
            );

            compilation.emitAsset(
              `${relative(compiler.context, filename)}.json`,
              new sources.RawSource(JSON.stringify(config, null, 2)),
            );

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

    const css = styles?.length > 0 ? styles : [];

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

  injectScriptSetup(filename, descriptor) {
    const io = compileScript(descriptor, {
      id: '$$mainBlock',
      sourceMap: false,
      genDefaultAs: '$$mainBlock',
    }).content;

    const script = [
      "import { defineComponent } from '@vue-mini/core';",
      io
        .replace('__expose();', '')
        .replace('expose: __expose', '')
        .replace(
          "Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })",
          '',
        ),
      'defineComponent($$mainBlock);',
    ].join('\n');

    return this.inject(filename, 'js', script);
  }

  injectConfig(filename, customBlocks) {
    const config = mergeConfig(
      customBlocks.length > 0
        ? customBlocks
        : [{ type: 'config', lang: 'json', content: '{ }' }],
    );

    const entries = this.mapComponentsEntries(filename, config.usingComponents);

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
    const { descriptor } = parse(source, {
      sourceMap: false,
      templateParseOptions: { comments: false },
    });

    const { script, scriptSetup, template, styles, customBlocks } = descriptor;

    const paths = [];

    const { config, entries } = this.injectConfig(filename, customBlocks);

    const tpl = this.injectTemplate(filename, template);
    paths.push(tpl);

    const io = this.injectStyles(filename, styles);
    paths.push(...io);

    if (script?.content) {
      if (scriptSetup?.content) {
        const js = this.injectScriptSetup(filename, descriptor);
        paths.push(js);
      } else {
        const js = this.injectScript(filename, script);
        paths.push(js);
      }
    }

    return {
      config,
      entries,
      paths: paths.map((path) => slash(path)),
    };
  }
};
