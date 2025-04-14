import { readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import slash from 'slash';

import { CLSX_PLACEHOLDER } from '../helper.mjs';

const PLUGIN_NAME = 'AddWxsPlugin';

const filename = 'wxs/clsx.wxs';

function readFile() {
  return readFileSync(new URL('../wxs/clsx.wxs', import.meta.url), 'utf8');
}

export class AddWxsPlugin {
  apply(compiler) {
    const {
      sources: { RawSource },
      Compilation,
    } = compiler.webpack;

    const wxsContent = readFile();

    compiler.hooks.make.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: PLUGIN_NAME,
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
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
              source.source().includes(CLSX_PLACEHOLDER)
            ) {
              const path = slash(relative(join(assetName, '..'), filename));

              compilation.updateAsset(
                assetName,
                (old) =>
                  new RawSource(
                    old.source().toString().replace(CLSX_PLACEHOLDER, path),
                  ),
              );
            }
          }
        },
      );
    });
  }
}
