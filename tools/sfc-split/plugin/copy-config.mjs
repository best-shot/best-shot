import { readYAML, toJSONString } from '../helper.mjs';

const PLUGIN_NAME = 'CopyConfigPlugin';

export class CopyConfigPlugin {
  constructor({ type = false } = {}) {
    this.type = type;
  }

  apply(compiler) {
    const {
      sources: { RawSource },
      Compilation: { PROCESS_ASSETS_STAGE_ADDITIONAL },
    } = compiler.webpack;

    const { type } = this;

    if (type) {
      compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
        function emitJSON(name, json) {
          compilation.hooks.processAssets.tap(
            {
              name: PLUGIN_NAME,
              stage: PROCESS_ASSETS_STAGE_ADDITIONAL,
            },
            () => {
              compilation.emitAsset(
                type === 'plugin' ? `../${name}` : name,
                new RawSource(toJSONString(json)),
              );
            },
          );
        }

        const io = readYAML(compiler.context, 'project.config');

        if (Object.keys(io).length > 0) {
          emitJSON('project.config.json', {
            srcMiniprogramRoot: '',
            miniprogramRoot: '',
            pluginRoot: '',
            ...io,
            compileType: type,
          });
        }

        const io2 = readYAML(compiler.context, 'project.private.config');

        if (Object.keys(io2).length > 0) {
          emitJSON('project.private.config.json', io2);
        }
      });
    }
  }
}
