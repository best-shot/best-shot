import { readYAML } from '../helper.mjs';
import { toJSONString } from '../parse/lib.mjs';

const PLUGIN_NAME = 'CopyConfigPlugin';

export class CopyConfigPlugin {
  constructor({ type = false } = {}) {
    this.type = type;
  }

  apply(compiler) {
    const {
      sources: { RawSource },
    } = compiler.webpack;

    class RawJSONSource extends RawSource {
      constructor(input) {
        super(toJSONString(input));
      }
    }

    if (this.type) {
      compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
        compilation.hooks.buildModule.tap(PLUGIN_NAME, () => {
          const io = readYAML(compiler.context, 'project.config');

          const pathWrap =
            this.type === 'plugin' ? (src) => `../${src}` : (src) => src;

          if (Object.keys(io).length > 0) {
            compilation.emitAsset(
              pathWrap('project.config.json'),
              new RawJSONSource({
                srcMiniprogramRoot: '',
                miniprogramRoot: '',
                pluginRoot: '',
                ...io,
                compileType: this.type,
              }),
            );
          }

          const io2 = readYAML(compiler.context, 'project.private.config');

          if (Object.keys(io2).length > 0) {
            compilation.emitAsset(
              pathWrap('project.config.private.json'),
              new RawJSONSource(io2),
            );
          }
        });
      });
    }
  }
}
