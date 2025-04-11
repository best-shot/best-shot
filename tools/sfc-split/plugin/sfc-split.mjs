import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { kebabCase } from 'change-case-legacy';
import slash from 'slash';
import VirtualModulesPlugin from 'webpack-virtual-modules';

import { COMPONENT_ROOT } from '../helper.mjs';
import { mergeConfig, toJSONString } from '../parse/lib.mjs';
import { parse } from '../parse/sfc.mjs';

const PLUGIN_NAME = 'SfcSplitPlugin';

export class SfcSplitPlugin extends VirtualModulesPlugin {
  apply(compiler) {
    super.apply(compiler);

    const newEntries = new Map();

    compiler.options.module.rules.push(
      {
        exclude: /\.(vue|wxml)$/,
        layer: 'other',
      },
      {
        test: /\.vue$/,
        loader: fileURLToPath(
          import.meta.resolve('../loader/fake-vue-loader.cjs'),
        ),
        options: {
          api: this,
          componentRoot: COMPONENT_ROOT,
          caller({ entryName, entryPath }) {
            newEntries.set(entryName, entryPath);
          },
        },
      },
      {
        test: /\.wxml$/,
        type: 'asset/resource',
        loader: fileURLToPath(
          import.meta.resolve('../loader/wxml-parse-loader.cjs'),
        ),
        generator: {
          filename: (args) => `${args.module.layer}[ext]`,
        },
      },
    );

    const {
      EntryPlugin: { createDependency },
    } = compiler.webpack;

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
      `-${id}.${style.lang ?? 'css'}`,
      style.content.trim(),
    );
  }

  injectStyles(resourcePath, styles) {
    const io = [];

    const css = styles?.length > 0 ? styles : [];

    css.forEach((style, idx) => {
      if (style?.content) {
        const path = this.injectStyle(resourcePath, idx, style);
        io.push(path);
      }
    });

    return io;
  }

  injectTemplate(resourcePath, tpl) {
    return this.inject(resourcePath, '.wxml', tpl);
  }

  // eslint-disable-next-line class-methods-use-this
  injectConfig(customBlocks, pair) {
    const components =
      pair.length > 0
        ? Object.fromEntries(
            pair.map(({ local, source }) => [kebabCase(local), source]),
          )
        : undefined;

    const config = mergeConfig([
      ...(customBlocks?.length ? customBlocks : []),
      {
        type: 'config',
        lang: 'json',
        content: toJSONString({
          component: true,
          usingComponents: components,
        }),
      },
    ]);

    return { config };
  }

  processSfcFile(source, resourcePath) {
    const { tpl, styles, customBlocks, code, pair = [] } = parse(source);

    const { config } = this.injectConfig(customBlocks, pair);

    const paths = [];

    const src = this.injectTemplate(resourcePath, tpl);
    paths.push(src);

    const css = this.injectStyles(resourcePath, styles);
    paths.push(...css);

    return {
      config,
      paths: paths.map((path) => slash(path)),
      script: code,
    };
  }
}
