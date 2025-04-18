import { createEmitFile, readAndTrack } from '../helper/hooks.mjs';

const PLUGIN_NAME = 'CopyConfigPlugin';

export class CopyConfigPlugin {
  constructor({ type = false } = {}) {
    this.type = type;
  }

  apply(compiler) {
    const {
      sources: { RawSource },
      Compilation,
    } = compiler.webpack;

    const { type } = this;

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      const emitFile = createEmitFile({
        PLUGIN_NAME,
        compilation,
        RawSource,
        Compilation,
      });
      const readFrom = readAndTrack(compiler, compilation);

      function emitJSON(name, json) {
        emitFile(type === 'plugin' ? `../${name}` : name, json);
      }

      const io = readFrom('project.config');

      if (!io.empty) {
        emitJSON(io.name, {
          srcMiniprogramRoot: '',
          miniprogramRoot: '',
          pluginRoot: '',
          ...io.content,
          compileType: type,
        });
      }

      const io2 = readFrom('project.private.config');

      if (!io2.empty) {
        emitJSON(io2.name, io2.content);
      }
    });
  }
}
