'use strict';

const { getAllPages, readYAML } = require('./helper.cjs');
const { readFileSync } = require('node:fs');
const { join, relative, extname, resolve } = require('node:path');
const VirtualModulesPlugin = require('webpack-virtual-modules');
const { parse } = require('@vue/compiler-sfc');
const { parse: yamlParse } = require('yaml');
const { deepmerge: deepMerge } = require('deepmerge-ts');
const slash = require('slash');
const { action } = require('./action.cjs');
const { vueMiniCode } = require('./setup.cjs');

const PLUGIN_NAME = 'SfcSplitPlugin';

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
  constructor({ appConfig = false } = {}) {
    super();
    this.appConfig = appConfig;
  }

  apply(compiler) {
    super.apply(compiler);

    const newEntries = new Map();

    compiler.options.module.rules.push(
      {
        test: /\.vue$/,
        loader: require.resolve('./vue-loader.cjs'),
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
        loader: require.resolve('./wxml-parse-loader.cjs'),
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
      compiler.options.entry = {};

      if (this.appConfig) {
        new EntryPlugin(compiler.context, './app', {
          name: 'app',
          layer: 'app',
          import: ['./app'],
        }).apply(compiler);

        const config = readYAML(compiler.context);

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
      }
    });

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      const wxsContent = readFileSync(join(__dirname, wxs), 'utf8');
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
    const path = resolve(resourcePath, `../@fake${ext}`);

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

  injectConfig(customBlocks) {
    const config = mergeConfig(
      customBlocks?.length > 0
        ? customBlocks
        : [{ type: 'config', lang: 'json', content: '{ }' }],
    );

    return { config };
  }

  processSfcFile(source, resourcePath) {
    const { descriptor } = parse(source, {
      sourceMap: false,
      templateParseOptions: { comments: false },
    });

    const { script, template, styles, customBlocks } = descriptor;

    const { config } = this.injectConfig(customBlocks);

    const paths = [];

    const tpl = this.injectTemplate(resourcePath, template);
    paths.push(tpl);

    const css = this.injectStyles(resourcePath, styles);
    paths.push(...css);

    return {
      config,
      paths: paths.map((path) => slash(path)),
      script: script?.content ? vueMiniCode(descriptor) : '',
    };
  }
};
