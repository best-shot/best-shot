import { extname } from 'node:path';

import { getAllPages, readYAML } from '../helper.mjs';
import { toJSONString } from '../parse/lib.mjs';

const PLUGIN_NAME = 'AddEntryPlugin';

export class AddEntryPlugin {
  constructor({ type = false } = {}) {
    this.type = type;
  }

  apply(compiler) {
    const {
      sources: { RawSource },
      EntryPlugin,
    } = compiler.webpack;

    class RawJSONSource extends RawSource {
      constructor(input) {
        super(toJSONString(input));
      }
    }

    class AddOneEntryPlugin extends EntryPlugin {
      constructor(entry, name) {
        super(compiler.context, entry, {
          import: [entry],
          layer: name,
          name,
        });
      }
    }

    compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
      // eslint-disable-next-line no-param-reassign
      delete compiler.options.entry.main;

      if (this.type === 'miniprogram') {
        new AddOneEntryPlugin('./app', 'app').apply(compiler);

        const config = readYAML(compiler.context, 'app');

        compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: PLUGIN_NAME,
              stage:
                compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            },
            () => {
              compilation.emitAsset('app.json', new RawJSONSource(config));
            },
          );
        });

        const allPages = getAllPages(config);

        for (const page of allPages) {
          new AddOneEntryPlugin(`./${page}.vue`, page).apply(compiler);
        }
      } else if (this.type === 'plugin') {
        const config = readYAML(compiler.context, 'plugin');

        if (config.main) {
          new AddOneEntryPlugin(config.main, 'main').apply(compiler);

          config.main = 'main.js';
        }

        if (config.pages && Object.keys(config.pages).length > 0) {
          for (const [key, path] of Object.entries(config.pages)) {
            if (extname(path) === '.vue') {
              new AddOneEntryPlugin(path, `pages/${key}/index`).apply(compiler);

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
              new AddOneEntryPlugin(path, `components/${key}/index`).apply(
                compiler,
              );

              config.publicComponents[key] = `components/${key}/index`;
            }
          }
        }

        compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
          compilation.hooks.processAssets.tap(
            {
              name: PLUGIN_NAME,
              stage:
                compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            },
            () => {
              compilation.emitAsset('plugin.json', new RawJSONSource(config));
            },
          );
        });
      }
    });
  }
}
