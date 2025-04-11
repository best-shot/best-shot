import { extname } from 'node:path';

import {
  COMPONENT_ROOT,
  getAllPages,
  patchConfig,
  readYAML,
  toJSONString,
} from '../helper.mjs';

const PLUGIN_NAME = 'AddEntryPlugin';

function emitFake(emitFile) {
  emitFile(`${COMPONENT_ROOT}/fake.json`, '{}');
  const message = `这是一个用于创建${COMPONENT_ROOT}分包的假页面`;
  emitFile(`${COMPONENT_ROOT}/fake.js`, `/**${message}**/`);
  emitFile(`${COMPONENT_ROOT}/fake.wxml`, `<!--${message}-->`);
}

export class AddEntryPlugin {
  constructor({ type = false } = {}) {
    this.type = type;
  }

  apply(compiler) {
    const {
      sources: { RawSource },
      EntryPlugin,
      Compilation,
    } = compiler.webpack;

    function readFile(name) {
      return readYAML(compiler.context, name);
    }

    function emitFile(name, content) {
      compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: PLUGIN_NAME,
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          () => {
            compilation.emitAsset(name, new RawSource(content));
          },
        );
      });
    }

    function emitJSON(name, json) {
      emitFile(name, toJSONString(json));
    }

    function addEntry(name, path) {
      new EntryPlugin(compiler.context, path, {
        import: [path],
        layer: name,
        name,
      }).apply(compiler);
    }

    const { type } = this;

    compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
      // eslint-disable-next-line no-param-reassign
      delete compiler.options.entry.main;

      if (type === 'miniprogram') {
        emitFake(emitFile);

        addEntry('app', './app');

        const config = readFile('app');

        emitJSON('app.json', patchConfig(config));

        for (const page of getAllPages(config)) {
          addEntry(page, `./${page}.vue`);
        }
      } else if (type === 'plugin') {
        const config = readFile('plugin');

        if (config.main) {
          addEntry('main', config.main);

          config.main = 'main.js';
        }

        function patchingPluginConfig(keyPath) {
          const io = config[keyPath];

          if (io && Object.keys(io).length > 0) {
            for (const [key, path] of Object.entries(io)) {
              if (extname(path) === '.vue') {
                const source = `${keyPath}/${key}/index`;

                addEntry(source, path);

                config.pages[key] = source;
              }
            }
          }
        }

        patchingPluginConfig('pages');

        patchingPluginConfig('publicComponents');

        emitJSON('plugin.json', config);
      }
    });
  }
}
