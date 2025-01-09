import { readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { kebabCase } from 'change-case-legacy';
import slash from 'slash';
import VirtualModulesPlugin from 'webpack-virtual-modules';

import { parse } from '@vue/compiler-sfc';

import { action } from './action.mjs';
import { getAllPages, readYAML } from './helper.mjs';
import { mergeConfig } from './lib.mjs';
import { vueMiniCode } from './setup.mjs';

const PLUGIN_NAME = 'SfcSplitPlugin';

export class SfcSplitPlugin extends VirtualModulesPlugin {
  constructor({ type = false } = {}) {
    super();
    this.type = type;
  }

  apply(compiler) {
    super.apply(compiler);

    const newEntries = new Map();

    compiler.options.module.rules.push(
      {
        test: /\.vue$/,
        loader: fileURLToPath(import.meta.resolve('./vue-loader.cjs')),
        options: {
          api: this,
          caller({ entryName, entryPath }) {
            newEntries.set(entryName, entryPath);
          },
        },
      },
      {
        test: /\.wxml$/,
        type: 'asset/resource',
        loader: fileURLToPath(import.meta.resolve('./wxml-parse-loader.cjs')),
        generator: {
          filename: (args) => `${args.module.layer}[ext]`,
        },
      },
    );

    const wxs = 'wxs/clsx.wxs';

    const {
      sources: { RawSource, ConcatSource },
      EntryPlugin: { createDependency },
      EntryPlugin,
    } = compiler.webpack;

    compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
      // eslint-disable-next-line no-param-reassign
      delete compiler.options.entry.main;

      if (this.type === 'app') {
        new EntryPlugin(compiler.context, './app', {
          name: 'app',
          layer: 'app',
          import: ['./app'],
        }).apply(compiler);

        const config = readYAML(compiler.context, 'app');

        compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
          compilation.hooks.buildModule.tap(PLUGIN_NAME, () => {
            compilation.emitAsset(
              'app.json',
              new RawSource(JSON.stringify(config, null, 2)),
            );
          });
        });

        const allPages = getAllPages(config);

        for (const page of allPages) {
          new EntryPlugin(compiler.context, `./${page}.vue`, {
            import: [`./${page}.vue`],
            layer: page,
            name: page,
          }).apply(compiler);
        }
      } else if (this.type === 'plugin') {
        const config = readYAML(compiler.context, 'plugin');

        if (config.main) {
          new EntryPlugin(compiler.context, config.main, {
            import: [config.main],
            layer: 'main',
            name: 'main',
          }).apply(compiler);

          config.main = 'main.js';
        }

        if (config.pages && Object.keys(config.pages).length > 0) {
          for (const [key, path] of Object.entries(config.pages)) {
            if (extname(path) === '.vue') {
              new EntryPlugin(compiler.context, path, {
                import: [path],
                layer: `pages/${key}/index`,
                name: `pages/${key}/index`,
              }).apply(compiler);

              config.pages[key] = `pages/${key}/index`;
            }
          }
        }

        if (
          config.publicComponents &&
          Object.keys(config.publicComponents).length > 0
        ) {
          for (const [key, path] of Object.entries(config.publicComponents)) {
            if (extname(path) === '.vue') {
              new EntryPlugin(compiler.context, path, {
                import: [path],
                layer: `components/${key}/index`,
                name: `components/${key}/index`,
              }).apply(compiler);

              config.publicComponents[key] = `components/${key}/index`;
            }
          }
        }

        compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
          compilation.hooks.buildModule.tap(PLUGIN_NAME, () => {
            compilation.emitAsset(
              'plugin.json',
              new RawSource(JSON.stringify(config, null, 2)),
            );
          });
        });
      }
    });

    compiler.hooks.normalModuleFactory.tap(
      PLUGIN_NAME,
      (normalModuleFactory) => {
        normalModuleFactory.hooks.beforeResolve.tap(PLUGIN_NAME, (result) => {
          if (result.request === './index.js') {
            console.log('beforeResolve', result);

            // result.request = '';
          }
        });
      },
    );

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      const wxsContent = readFileSync(new URL(wxs, import.meta.url), 'utf8');
      compilation.emitAsset(wxs, new RawSource(wxsContent));

      compilation.hooks.processAssets.tap(PLUGIN_NAME, (assets) => {
        for (const [assetName, source] of Object.entries(assets)) {
          if (
            extname(assetName) === '.wxml' &&
            source.source().includes('clsx.clsx(')
          ) {
            const path = slash(relative(join(assetName, '..'), wxs));
            const head = `<wxs src="${path}" module="clsx" />\n`;
            compilation.updateAsset(
              assetName,
              (old) => new ConcatSource(head, old),
            );
          }
        }
      });
    });

    compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.buildModule.tap(PLUGIN_NAME, () => {
        for (const [entryName, entryPath] of newEntries.entries()) {
          compilation.addEntry(
            compiler.context,
            createDependency(entryPath),
            {
              name: entryName,
              layer: entryName,
            },
            (err) => {
              if (err) {
                throw err;
              }
            },
          );
        }
      });
    });
  }

  inject(resourcePath, ext, content) {
    const path = resolve(resourcePath.replace(/\.vue$/, ext));

    super.writeModule(path, content);

    return path;
  }

  injectStyle(resourcePath, id, style) {
    return this.inject(
      resourcePath,
      `-${id}.${style.ext ?? 'css'}`,
      style.content.trim(),
    );
  }

  injectStyles(resourcePath, styles) {
    const io = [];

    const css = styles?.length > 0 ? styles : [{ content: '/**/' }];

    css.forEach((style, idx) => {
      if (style?.content) {
        const path = this.injectStyle(resourcePath, idx, style);
        io.push(path);
      }
    });

    return io;
  }

  injectTemplate(resourcePath, template) {
    return this.inject(
      resourcePath,
      '.wxml',
      template ? action(template).tpl : '<!-- -->',
    );
  }

  // eslint-disable-next-line class-methods-use-this
  injectConfig(customBlocks, pair) {
    const config = mergeConfig([
      ...(customBlocks?.length > 0 ? customBlocks : []),
      {
        type: 'config',
        lang: 'json',
        content: JSON.stringify(
          {
            component: true,
            usingComponents:
              pair.length > 0
                ? Object.fromEntries(
                    pair.map(({ local, source }) => [kebabCase(local), source]),
                  )
                : undefined,
          },
          null,
          2,
        ),
      },
    ]);

    return { config };
  }

  processSfcFile(source, resourcePath) {
    const { descriptor } = parse(source, {
      sourceMap: false,
      templateParseOptions: { comments: false },
    });

    const { template, styles, customBlocks } = descriptor;

    const { code, pair = [] } = vueMiniCode(descriptor);

    const { config } = this.injectConfig(customBlocks, pair);

    const paths = [];

    const tpl = this.injectTemplate(resourcePath, template);
    paths.push(tpl);

    const css = this.injectStyles(resourcePath, styles);
    paths.push(...css);

    return {
      config,
      paths: paths.map((path) => slash(path)),
      script: code,
    };
  }
}
