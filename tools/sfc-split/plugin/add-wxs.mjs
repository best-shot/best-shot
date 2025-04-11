import { readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import slash from 'slash';

const PLUGIN_NAME = 'AddWxsPlugin';

const filename = 'wxs/clsx.wxs';

function readFile() {
  return readFileSync(new URL('../wxs/clsx.wxs', import.meta.url), 'utf8');
}

export class AddWxsPlugin {
  apply(compiler) {
    const {
      sources: { RawSource, ConcatSource },
      Compilation,
    } = compiler.webpack;

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          const wxsContent = readFile();
          compilation.emitAsset(filename, new RawSource(wxsContent));
        },
      );

      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
          additionalAssets: true,
        },
        (assets) => {
          for (const [assetName, source] of Object.entries(assets)) {
            if (
              extname(assetName) === '.wxml' &&
              source.source().includes('clsx.clsx(')
            ) {
              const path = slash(relative(join(assetName, '..'), filename));
              const head = `<wxs src="${path}" module="clsx" />`;

              if (!source.source().includes(head)) {
                compilation.updateAsset(
                  assetName,
                  (old) => new ConcatSource(`${head}\n`, old),
                );
              }
            }
          }
        },
      );
    });
  }
}
