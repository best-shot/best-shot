import { extname } from 'node:path';

import {
  createAddEntry,
  createEmitFile,
  readAndTrack,
} from '../helper/hooks.mjs';
import { COMPONENT_ROOT, getAllPages, patchConfig } from '../helper/index.mjs';

const PLUGIN_NAME = 'AddEntryPlugin';

function emitFake(emitFile) {
  emitFile(`${COMPONENT_ROOT}/fake.json`, '{}');
  const message = '这是一个用于创建分包的假页面';
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

    const addEntry = createAddEntry(compiler, EntryPlugin);

    const { type } = this;

    if (type === 'miniprogram') {
      compiler.hooks.afterEnvironment.tap(PLUGIN_NAME, () => {
        // eslint-disable-next-line no-param-reassign
        delete compiler.options.entry.main;

        addEntry('app', './app');
      });

      compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
        compilation.fileDependencies.add('./app');

        const emitFile = createEmitFile({
          PLUGIN_NAME,
          compilation,
          RawSource,
          Compilation,
        });

        emitFake(emitFile);
      });
    }

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      const emitFile = createEmitFile({
        PLUGIN_NAME,
        compilation,
        RawSource,
        Compilation,
      });
      const readFrom = readAndTrack(compiler, compilation);

      if (type === 'miniprogram') {
        const { content: config, name } = readFrom('app');

        emitFile(name, patchConfig(config));

        for (const page of getAllPages(config)) {
          const source = `./${page}.vue`;

          addEntry(page, source, ['app']);

          compilation.fileDependencies.add(source);
        }
      } else if (type === 'plugin') {
        const { content: config, name } = readFrom('plugin');

        if (config.main) {
          addEntry('main', config.main);

          compilation.fileDependencies.add(config.main);

          config.main = 'main.js';
        }

        function patchingPluginConfig(keyPath) {
          const io = config[keyPath];

          if (io && Object.keys(io).length > 0) {
            for (const [key, path] of Object.entries(io)) {
              if (extname(path) === '.vue') {
                const source = `${keyPath}/${key}/index`;

                addEntry(source, path);

                compilation.fileDependencies.add(path);

                config.pages[key] = source;
              }
            }
          }
        }

        patchingPluginConfig('pages');

        patchingPluginConfig('publicComponents');

        emitFile(name, config);
      }
    });
  }
}
